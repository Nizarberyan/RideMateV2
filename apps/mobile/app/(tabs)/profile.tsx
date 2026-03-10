import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput,
  Alert,
  RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { User as UserIcon, Car, Save, LogOut, MapPin } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Profile() {
  const { user, client, signIn, signOut } = useAuth();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    city: '',
    vehicleModel: '',
    vehicleColor: '',
    vehiclePlate: '',
  });

  const loadProfile = useCallback(async () => {
    try {
      const updatedUser = await client.auth.getProfile();
      const token = await client.getToken();
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      
      if (token && refreshToken) {
        await signIn({
          access_token: token,
          refresh_token: refreshToken,
          user: updatedUser
        });
      }
    } catch (e) {
      console.error("Failed to refresh profile:", e);
    } finally {
      setRefreshing(false);
    }
  }, [client, signIn]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        city: user.city || '',
        vehicleModel: user.vehicleModel || '',
        vehicleColor: user.vehicleColor || '',
        vehiclePlate: user.vehiclePlate || '',
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const updatedUser = await client.auth.updateProfile(formData);
      // Update local context
      const token = await client.getToken();
      const refreshToken = await SecureStore.getItemAsync('refresh_token');
      
      if (token && refreshToken) {
        await signIn({
          access_token: token,
          refresh_token: refreshToken,
          user: updatedUser
        });
      }
      Alert.alert("Success", "Profile updated successfully!");
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={theme.primary}
            colors={[theme.primary]} 
            progressViewOffset={insets.top + 20}
          />
        }
      >
        <View style={styles.profileHeader}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.primary, shadowColor: theme.primary }]}>
            <UserIcon size={40} color="#000" />
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>{user?.name || "User"}</Text>
          <Text style={[styles.userEmail, { color: theme.textMuted }]}>{user?.email}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.sectionHeader}>
            <UserIcon size={18} color={theme.text} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>General Information</Text>
          </View>
          
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
            placeholder="Your Name"
            placeholderTextColor={theme.textMuted}
          />

          <Text style={styles.label}>Your City</Text>
          <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: theme.border, marginBottom: 15 }]}>
            <MapPin size={18} color={theme.textMuted} style={{ marginRight: 10 }} />
            <TextInput
              style={{ flex: 1, height: 45, color: theme.text }}
              value={formData.city}
              onChangeText={(text) => setFormData({...formData, city: text})}
              placeholder="e.g. San Francisco"
              placeholderTextColor={theme.textMuted}
            />
          </View>

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
            value={formData.bio}
            onChangeText={(text) => setFormData({...formData, bio: text})}
            placeholder="Tell others about yourself..."
            placeholderTextColor={theme.textMuted}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.sectionHeader}>
            <Car size={18} color={theme.text} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Vehicle Details</Text>
          </View>
          <Text style={[styles.sectionSub, { color: theme.textMuted }]}>Required to offer rides</Text>
          
          <Text style={styles.label}>Model</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
            value={formData.vehicleModel}
            onChangeText={(text) => setFormData({...formData, vehicleModel: text})}
            placeholder="e.g. Tesla Model 3"
            placeholderTextColor={theme.textMuted}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.label}>Color</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
                value={formData.vehicleColor}
                onChangeText={(text) => setFormData({...formData, vehicleColor: text})}
                placeholder="e.g. Silver"
                placeholderTextColor={theme.textMuted}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>License Plate</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
                value={formData.vehiclePlate}
                onChangeText={(text) => setFormData({...formData, vehiclePlate: text})}
                placeholder="e.g. ABC-1234"
                placeholderTextColor={theme.textMuted}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: isDark ? theme.primary : '#111827' }]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={isDark ? '#000' : '#fff'} />
          ) : (
            <>
              <Save size={20} color={isDark ? '#000' : '#fff'} />
              <Text style={[styles.saveButtonText, { color: isDark ? '#000' : '#fff' }]}>Save Profile</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.logoutButton, { marginTop: 20 }]} 
          onPress={signOut}
        >
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSub: {
    fontSize: 12,
    marginTop: -10,
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  saveButton: {
    borderRadius: 16,
    height: 55,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    height: 55,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
  },
});
