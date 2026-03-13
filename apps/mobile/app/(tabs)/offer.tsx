import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Car, MapPin, Calendar, Plus, AlertCircle, CheckCircle2, Clock, X } from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { Button, Input, Card } from '../../components/ui';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

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
      setDateSelected(true);
    }
  };

  const handleSubmit = async () => {
    if (!formData.startLocation || !formData.endLocation || !dateSelected) {
      Alert.alert("Required Fields", "Please select a valid date and time for your ride.");
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
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background, flexGrow: 1, paddingTop: insets.top + 20 }]}
      >
        <View style={{ backgroundColor: theme.primary, position: 'absolute', top: -(insets.top + 20), left: 0, right: 0, height: insets.top + 20 + 80, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }} />
        <View style={{ padding: 24, paddingTop: 0 }}>
          <Animated.Text 
            entering={FadeInUp.delay(200).duration(800).springify()}
            style={[styles.headerTitle, { color: '#151515', marginBottom: 8 }]}
          >
            Offer a Ride
          </Animated.Text>
          {!hasVehicle ? (
            <Card
              delay={400}
              style={[styles.warningBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#fffbeb', borderColor: isDark ? '#333' : '#fde68a', marginTop: 24 }]}
            >
              <View style={styles.warningContent}>
                <AlertCircle size={44} color="#b45309" />
                <Text style={[styles.warningTitle, { color: isDark ? '#fde68a' : '#92400e' }]}>Vehicle Info Missing</Text>
                <Text style={[styles.warningText, { color: isDark ? '#d1d5db' : '#b45309' }]}>
                  You need to add your vehicle details in your profile before you can offer a ride to the community.
                </Text>
                <Button
                  label="Go to Profile"
                  onPress={() => router.push('/profile')}
                  variant="black"
                  size="md"
                />
              </View>
            </Card>
          ) : (
            <View style={styles.form}>
              <Animated.Text 
                entering={FadeInUp.delay(300).duration(800).springify()}
                style={[styles.formSubtitle, { color: isDark ? 'rgba(21, 21, 21, 0.6)' : 'rgba(21, 21, 21, 0.5)', fontWeight: '900', marginBottom: 32, letterSpacing: 1 }]}
              >
                FILL IN THE TRIP DETAILS
              </Animated.Text>

              <Animated.View entering={FadeInDown.delay(400).duration(800).springify()}>
                <Input
                  label="Departure Location"
                  leftIcon={<MapPin size={20} color={theme.primary} />}
                  value={formData.startLocation}
                  onChangeText={(text) => setFormData({ ...formData, startLocation: text })}
                  placeholder="e.g. San Francisco"
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(500).duration(800).springify()}>
                <Input
                  label="Destination"
                  leftIcon={<MapPin size={20} color="#ef4444" />}
                  value={formData.endLocation}
                  onChangeText={(text) => setFormData({ ...formData, endLocation: text })}
                  placeholder="e.g. San Jose"
                />
              </Animated.View>

              <Animated.View 
                entering={FadeInDown.delay(600).duration(800).springify()}
                style={styles.row}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
                    <Input
                      label="Departure Date"
                      editable={false}
                      pointerEvents="none"
                      leftIcon={<Calendar size={20} color={theme.textMuted} />}
                      value={dateSelected ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ""}
                      placeholder="Select Date"
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity onPress={() => setShowTimePicker(true)} activeOpacity={0.7}>
                    <Input
                      label="Time"
                      editable={false}
                      pointerEvents="none"
                      leftIcon={<Clock size={20} color={theme.textMuted} />}
                      value={dateSelected ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      placeholder="Select Time"
                    />
                  </TouchableOpacity>
                </View>
              </Animated.View>

              {showTimePicker && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onTimeChange}
                />
              )}

              <Animated.View 
                entering={FadeInDown.delay(700).duration(800).springify()}
                style={styles.row}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Input
                    label="Seats"
                    value={formData.availableSeats}
                    onChangeText={(text) => setFormData({ ...formData, availableSeats: text })}
                    keyboardType="numeric"
                    placeholder="3"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Distance (km)"
                    value={formData.distanceKm}
                    onChangeText={(text) => setFormData({ ...formData, distanceKm: text })}
                    keyboardType="numeric"
                    placeholder="e.g. 75"
                  />
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(800).duration(800).springify()}>
                <Input
                  label="Additional Notes"
                  value={formData.description}
                  onChangeText={(text) => setFormData({ ...formData, description: text })}
                  placeholder="Any rules or pickup details?"
                  multiline
                  numberOfLines={3}
                />
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(900).duration(800).springify()}>
                <Button
                  label="Post Ride Offer"
                  variant="black"
                  size="lg"
                  icon={<Plus size={24} color={isDark ? theme.primary : '#fff'} />}
                  onPress={handleSubmit}
                  isLoading={isSubmitting}
                  style={{ marginTop: 12 }}
                />
              </Animated.View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Custom Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDatePicker(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <TouchableOpacity activeOpacity={1} style={{ width: '100%' }}>
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
                          { borderColor: theme.border },
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
                          if (Platform.OS === 'android') {
                            setTimeout(() => setShowTimePicker(true), 300);
                          }
                        }}
                      >
                        <Text style={[
                          styles.dayName,
                          { color: isSelected ? '#151515' : theme.textMuted }
                        ]}>
                          {d.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}
                        </Text>
                        <Text style={[
                          styles.dayNumber,
                          { color: isSelected ? '#151515' : theme.text }
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

              <Button
                label="Confirm Selection"
                variant="black"
                size="lg"
                onPress={() => setShowDatePicker(false)}
                style={{ marginTop: 24 }}
              />
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
    padding: 0,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  formSubtitle: {
    fontSize: 12,
  },
  form: {
    flex: 1,
    marginTop: 20,
  },
  warningBox: {
    padding: 0,
  },
  warningContent: {
    padding: 32,
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 16,
    marginBottom: 8,
  },
  warningText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: 24,
  },
  successSub: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  // Custom Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 32,
    paddingBottom: 48,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  calendarGrid: {
    paddingBottom: 24,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  dayButton: {
    width: (width - 100) / 4,
    height: 85,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayName: {
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 6,
  },
  dayNumber: {
    fontSize: 22,
    fontWeight: '900',
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    bottom: 12,
  }
});
