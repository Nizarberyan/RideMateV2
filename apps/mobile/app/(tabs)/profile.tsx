import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { User as UserIcon, Car, Save, LogOut, MapPin, Settings } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button, Input, Card, Toggle } from '../../components/ui';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function Profile() {
  const { user, client, signIn, signOut } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
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
        contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background, paddingTop: insets.top + 20 }]}
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
        <View style={{ backgroundColor: theme.background, position: 'absolute', top: -(insets.top + 20), left: 0, right: 0, height: insets.top + 20 + 100 }} />
        
        <Animated.View 
          entering={FadeInUp.delay(200).duration(800).springify()}
          style={styles.profileHeader}
        >
          <View style={[styles.avatarCircle, { backgroundColor: theme.primary, shadowColor: theme.primary }]}>
            <UserIcon size={44} color="#151515" />
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>{user?.name || "User"}</Text>
          <Text style={[styles.userEmail, { color: theme.textMuted }]}>{user?.email}</Text>
        </Animated.View>

        <Card 
          title="App Settings" 
          subTitle="Customize your app experience"
          icon={<Settings size={20} color={theme.text} />}
          style={styles.card}
          delay={400}
        >
          <Toggle 
            label="Dark Mode" 
            subLabel="Switch between light and dark themes"
            value={isDark}
            onValueChange={toggleTheme}
          />
        </Card>

        <Card 
          title="General Information" 
          subTitle="Manage your public profile details"
          icon={<UserIcon size={20} color={theme.text} />}
          style={styles.card}
          delay={500}
        >
          <Input
            label="Full Name"
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
            placeholder="e.g. John Doe"
          />

          <Input
            label="Home City"
            leftIcon={<MapPin size={20} color={theme.primary} />}
            value={formData.city}
            onChangeText={(text) => setFormData({...formData, city: text})}
            placeholder="e.g. San Francisco"
          />

          <Input
            label="Bio"
            value={formData.bio}
            onChangeText={(text) => setFormData({...formData, bio: text})}
            placeholder="Share a bit about yourself with the community..."
            multiline
            numberOfLines={4}
          />
        </Card>

        <Card 
          title="Vehicle Details" 
          subTitle="Add your car info to start hosting rides"
          icon={<Car size={20} color={theme.text} />}
          style={styles.card}
          delay={600}
        >
          <Input
            label="Vehicle Model"
            value={formData.vehicleModel}
            onChangeText={(text) => setFormData({...formData, vehicleModel: text})}
            placeholder="e.g. Tesla Model 3"
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Input
                label="Color"
                value={formData.vehicleColor}
                onChangeText={(text) => setFormData({...formData, vehicleColor: text})}
                placeholder="e.g. Silver"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="License Plate"
                value={formData.vehiclePlate}
                onChangeText={(text) => setFormData({...formData, vehiclePlate: text})}
                placeholder="e.g. ABC-1234"
              />
            </View>
          </View>
        </Card>

        <Animated.View entering={FadeInDown.delay(700).duration(800).springify()}>
          <Button 
            label="Save Changes" 
            variant="black"
            size="lg"
            icon={<Save size={22} color={isDark ? theme.primary : '#fff'} />}
            onPress={handleSubmit}
            isLoading={isSubmitting}
            style={styles.saveButton}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(800).duration(800).springify()}>
          <Button 
            label="Sign Out" 
            variant="danger"
            size="md"
            icon={<LogOut size={20} color="#ef4444" />}
            onPress={signOut}
            style={styles.logoutButton}
          />
        </Animated.View>
        
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
    padding: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  userName: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  card: {
    borderRadius: 32,
    borderWidth: 0,
    marginBottom: 24,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  row: {
    flexDirection: 'row',
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 20,
  },
  logoutButton: {
    marginTop: 20,
    borderRadius: 20,
  },
});
