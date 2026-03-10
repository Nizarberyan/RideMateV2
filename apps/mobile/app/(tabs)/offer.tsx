import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  TextInput,
  Alert,
  Platform,
  Modal,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Car, MapPin, Calendar, Plus, AlertCircle, CheckCircle2, Clock, X } from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function OfferRide() {
  const { user, client } = useAuth();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    startLocation: '',
    endLocation: '',
    availableSeats: '3',
    description: '',
    distanceKm: '',
  });

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);

  // Custom Date Options
  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  const hasVehicle = !!(user?.vehicleModel && user?.vehiclePlate);

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(date);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDate(newDate);
    }
  };

  const handleSubmit = async () => {
    if (!formData.startLocation || !formData.endLocation || !dateSelected) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await client.rides.create({
        startLocation: formData.startLocation,
        endLocation: formData.endLocation,
        departureDatetime: date.toISOString(),
        availableSeats: parseInt(formData.availableSeats),
        description: formData.description,
        distanceKm: parseInt(formData.distanceKm) || undefined,
      });
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          startLocation: '',
          endLocation: '',
          availableSeats: '3',
          description: '',
          distanceKm: '',
        });
        setDate(new Date());
        setDateSelected(false);
        router.push('/(tabs)');
      }, 2000);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Failed to create ride");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <CheckCircle2 size={64} color={theme.primary} />
        <Text style={[styles.successTitle, { color: theme.text }]}>Ride Offered!</Text>
        <Text style={[styles.successSub, { color: theme.textMuted }]}>Redirecting to dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}>
        <Text style={[styles.headerTitle, { color: theme.text, marginBottom: 10 }]}>Offer a Ride</Text>
        {!hasVehicle ? (
          <View style={[styles.warningBox, { backgroundColor: isDark ? '#1a1a1a' : '#fffbeb', borderColor: isDark ? '#333' : '#fde68a' }]}>
            <AlertCircle size={32} color="#b45309" />
            <Text style={[styles.warningTitle, { color: isDark ? '#fde68a' : '#92400e' }]}>Vehicle Info Missing</Text>
            <Text style={[styles.warningText, { color: isDark ? '#d1d5db' : '#b45309' }]}>
              You need to add your vehicle details in your profile before you can offer a ride.
            </Text>
            <TouchableOpacity 
              style={[styles.warningButton, { backgroundColor: theme.primary }]}
              onPress={() => router.push('/profile')}
            >
              <Text style={[styles.warningButtonText, { color: '#000' }]}>Go to Profile</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={[styles.formSubtitle, { color: theme.textMuted }]}>Fill in the trip details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Departure</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <MapPin size={18} color={theme.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.inputWithIcon, { color: theme.text }]}
                  value={formData.startLocation}
                  onChangeText={(text) => setFormData({...formData, startLocation: text})}
                  placeholder="e.g. San Francisco"
                  placeholderTextColor={theme.textMuted}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Destination</Text>
              <View style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <MapPin size={18} color={theme.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.inputWithIcon, { color: theme.text }]}
                  value={formData.endLocation}
                  onChangeText={(text) => setFormData({...formData, endLocation: text})}
                  placeholder="e.g. San Jose"
                  placeholderTextColor={theme.textMuted}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity 
                  style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Calendar size={18} color={theme.textMuted} style={styles.inputIcon} />
                  <Text style={[styles.inputWithIcon, { color: dateSelected ? theme.text : theme.textMuted, textAlignVertical: 'center', lineHeight: 55 }]}>
                    {dateSelected ? date.toLocaleDateString() : "Select Date"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Time</Text>
                <TouchableOpacity 
                  style={[styles.inputWrapper, { backgroundColor: theme.surface, borderColor: theme.border }]}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Clock size={18} color={theme.textMuted} style={styles.inputIcon} />
                  <Text style={[styles.inputWithIcon, { color: dateSelected ? theme.text : theme.textMuted, textAlignVertical: 'center', lineHeight: 55 }]}>
                    {dateSelected ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Select Time"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Time Picker Still uses system picker because it's already quite good for time */}
            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.label}>Seats</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                  value={formData.availableSeats}
                  onChangeText={(text) => setFormData({...formData, availableSeats: text})}
                  keyboardType="numeric"
                  placeholder="3"
                  placeholderTextColor={theme.textMuted}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Distance (km)</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                  value={formData.distanceKm}
                  onChangeText={(text) => setFormData({...formData, distanceKm: text})}
                  keyboardType="numeric"
                  placeholder="e.g. 75"
                  placeholderTextColor={theme.textMuted}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                value={formData.description}
                onChangeText={(text) => setFormData({...formData, description: text})}
                placeholder="Any rules or pickup details?"
                placeholderTextColor={theme.textMuted}
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Plus size={20} color="#000" />
                  <Text style={styles.submitButtonText}>Post Ride Offer</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Custom Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowDatePicker(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.calendarGrid}
            >
              <View style={styles.daysContainer}>
                {calendarDays.map((d, index) => {
                  const isSelected = dateSelected && date.toDateString() === d.toDateString();
                  const isToday = new Date().toDateString() === d.toDateString();
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayButton,
                        isSelected && { backgroundColor: theme.primary, borderColor: theme.primary }
                      ]}
                      onPress={() => {
                        const newDate = new Date(date);
                        newDate.setFullYear(d.getFullYear());
                        newDate.setMonth(d.getMonth());
                        newDate.setDate(d.getDate());
                        setDate(newDate);
                        setDateSelected(true);
                        setShowDatePicker(false);
                        // Automatically show time picker on Android for better flow
                        if (Platform.OS === 'android') {
                          setTimeout(() => setShowTimePicker(true), 300);
                        }
                      }}
                    >
                      <Text style={[
                        styles.dayName, 
                        { color: isSelected ? '#000' : theme.textMuted }
                      ]}>
                        {d.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}
                      </Text>
                      <Text style={[
                        styles.dayNumber, 
                        { color: isSelected ? '#000' : theme.text }
                      ]}>
                        {d.getDate()}
                      </Text>
                      {isToday && !isSelected && (
                        <View style={[styles.todayDot, { backgroundColor: theme.primary }]} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
            
            <TouchableOpacity 
              style={[styles.confirmButton, { backgroundColor: theme.primary }]}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContent: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  formSubtitle: {
    fontSize: 16,
    marginBottom: 25,
    fontWeight: '500',
  },
  warningBox: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 15,
    marginBottom: 10,
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  warningButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 12,
  },
  warningButtonText: {
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 20,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputWithIcon: {
    flex: 1,
    height: 55,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 15,
    fontSize: 16,
    height: 55,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  submitButton: {
    borderRadius: 20,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '900',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 20,
  },
  successSub: {
    fontSize: 16,
    marginTop: 10,
  },
  // Custom Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  calendarGrid: {
    paddingBottom: 20,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  dayButton: {
    width: (width - 80) / 4,
    height: 80,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  dayName: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: '900',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 10,
  },
  confirmButton: {
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
  }
});
