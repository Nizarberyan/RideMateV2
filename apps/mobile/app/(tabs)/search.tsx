import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search as SearchIcon, MapPin, Calendar, Users, ArrowRight, X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Ride } from '@repo/api-client';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function SearchScreen() {
  const { client, user } = useAuth();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Search Form State
  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '',
    date: null as Date | null,
  });

  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // Custom Date Picker Logic
  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    // Show next 30 days
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  const loadInitialRides = useCallback(async () => {
    try {
      const initialRides = await client.rides.getAll({ city: user?.city || undefined });
      setRides(initialRides);
      setIsSearching(false);
    } catch (e) {
      console.error("Failed to load initial rides:", e);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [client, user?.city]);

  const handleSearch = async () => {
    if (!searchForm.from && !searchForm.to && !searchForm.date) {
      loadInitialRides();
      return;
    }

    setIsLoading(true);
    setIsSearching(true);
    try {
      const results = await client.rides.getAll({
        from: searchForm.from || undefined,
        to: searchForm.to || undefined,
        date: searchForm.date ? searchForm.date.toISOString().split('T')[0] : undefined,
      });
      setRides(results);
    } catch (e: any) {
      Alert.alert("Search Error", e.message || "Failed to search rides");
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchForm({ from: '', to: '', date: null });
    loadInitialRides();
  };

  useEffect(() => {
    loadInitialRides();
  }, [loadInitialRides]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (isSearching) {
      handleSearch();
    } else {
      loadInitialRides();
    }
  }, [loadInitialRides, isSearching, searchForm]);

  if (isLoading && !refreshing) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={[
          styles.searchHeader, 
          { 
            backgroundColor: theme.surface, 
            borderBottomColor: theme.border,
            paddingTop: insets.top + 10
          }
        ]}>
          <Text style={[styles.searchTitle, { color: theme.text }]}>Find your next ride</Text>
          
          <View style={styles.formContainer}>
            <View style={[styles.inputRow, { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
              <MapPin size={18} color={theme.primary} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="From where?"
                placeholderTextColor={theme.textMuted}
                value={searchForm.from}
                onChangeText={(text) => setSearchForm({...searchForm, from: text})}
              />
            </View>
            
            <View style={[styles.inputRow, { borderBottomWidth: 1, borderBottomColor: theme.border }]}>
              <MapPin size={18} color="#ef4444" />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="To where?"
                placeholderTextColor={theme.textMuted}
                value={searchForm.to}
                onChangeText={(text) => setSearchForm({...searchForm, to: text})}
              />
            </View>

            <TouchableOpacity 
              style={styles.inputRow}
              onPress={() => setShowCustomPicker(true)}
              activeOpacity={0.7}
            >
              <Calendar size={18} color={theme.textMuted} />
              <Text style={[
                styles.dateText, 
                { color: searchForm.date ? theme.text : theme.textMuted }
              ]}>
                {searchForm.date 
                  ? searchForm.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
                  : "When do you want to leave?"
                }
              </Text>
              {isSearching && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                  <X size={18} color={theme.textMuted} />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.searchButton, { backgroundColor: theme.isDark ? theme.primary : '#111827' }]}
            onPress={handleSearch}
          >
            <SearchIcon size={18} color={theme.isDark ? '#000' : '#fff'} />
            <Text style={[styles.searchButtonText, { color: theme.isDark ? '#000' : '#fff' }]}>Search Rides</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor={theme.primary}
              colors={[theme.primary]} 
              progressViewOffset={20}
            />
          }
        >
          <View style={styles.resultsHeader}>
            <Text style={[styles.resultsLabel, { color: theme.text }]}>
              {isSearching ? `Found ${rides.length} rides` : user?.city ? `Rides in ${user.city}` : "All Rides"}
            </Text>
            {!isSearching && (
              <View style={[styles.nearBadge, { backgroundColor: theme.isDark ? 'rgba(190, 242, 100, 0.1)' : 'rgba(190, 242, 100, 0.2)' }]}>
                <Text style={[styles.nearText, { color: theme.isDark ? theme.primary : '#4d7c0f' }]}>NEAR YOU</Text>
              </View>
            )}
          </View>

          {rides.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <SearchIcon size={32} color={theme.textMuted} />
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                No rides found. Try a different search.
              </Text>
            </View>
          ) : (
            rides.map((ride) => (
              <TouchableOpacity 
                key={ride.id} 
                style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.locationContainer}>
                    <View style={styles.locationRow}>
                      <Text style={[styles.locationText, { color: theme.text }]}>{ride.startLocation}</Text>
                      <ArrowRight size={14} color={theme.textMuted} style={{ marginHorizontal: 8 }} />
                      <Text style={[styles.locationText, { color: theme.text }]}>{ride.endLocation}</Text>
                    </View>
                    <Text style={[styles.rideDate, { color: theme.textMuted }]}>
                      {new Date(ride.departureDatetime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  
                  <View style={styles.priceContainer}>
                    <Text style={[styles.price, { color: theme.text }]}>$25</Text>
                  </View>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.border }]} />

                <View style={styles.cardFooter}>
                  <View style={styles.driverInfo}>
                    <View style={[styles.driverAvatar, { backgroundColor: theme.primary }]}>
                      <Text style={styles.avatarText}>{ride.driver?.name?.charAt(0) || 'U'}</Text>
                    </View>
                    <View>
                      <Text style={[styles.driverName, { color: theme.text }]}>{ride.driver?.name || "Unknown Driver"}</Text>
                      <Text style={[styles.vehicleInfo, { color: theme.textMuted }]}>
                        {ride.driver?.vehicleModel || "No car info"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.seatsBadge}>
                    <Users size={14} color={theme.textMuted} />
                    <Text style={[styles.seatsText, { color: theme.textMuted }]}>{ride.availableSeats} left</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Date Picker Modal */}
      <Modal
        visible={showCustomPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCustomPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowCustomPicker(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowCustomPicker(false)}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.calendarGrid}
            >
              <View style={styles.daysContainer}>
                {calendarDays.map((date, index) => {
                  const isSelected = searchForm.date?.toDateString() === date.toDateString();
                  const isToday = new Date().toDateString() === date.toDateString();
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dayButton,
                        isSelected && { backgroundColor: theme.primary, borderColor: theme.primary }
                      ]}
                      onPress={() => {
                        setSearchForm({...searchForm, date});
                        setShowCustomPicker(false);
                      }}
                    >
                      <Text style={[
                        styles.dayName, 
                        { color: isSelected ? '#000' : theme.textMuted }
                      ]}>
                        {date.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}
                      </Text>
                      <Text style={[
                        styles.dayNumber, 
                        { color: isSelected ? '#000' : theme.text }
                      ]}>
                        {date.getDate()}
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
              onPress={() => setShowCustomPicker(false)}
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
  },
  searchHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  searchTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  formContainer: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  dateText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '600',
  },
  clearButton: {
    padding: 5,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    borderRadius: 18,
    gap: 10,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
  scrollContent: {
    padding: 20,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  resultsLabel: {
    fontSize: 18,
    fontWeight: '800',
  },
  nearBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  nearText: {
    fontSize: 10,
    fontWeight: '900',
  },
  emptyState: {
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 20,
  },
  emptyText: {
    marginTop: 10,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  card: {
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  locationContainer: {
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 17,
    fontWeight: '800',
  },
  rideDate: {
    fontSize: 13,
    fontWeight: '500',
  },
  priceContainer: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: '900',
  },
  divider: {
    height: 1,
    marginVertical: 15,
    opacity: 0.5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
  },
  driverName: {
    fontSize: 14,
    fontWeight: '700',
  },
  vehicleInfo: {
    fontSize: 11,
    fontWeight: '500',
  },
  seatsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  seatsText: {
    fontSize: 12,
    fontWeight: '700',
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
