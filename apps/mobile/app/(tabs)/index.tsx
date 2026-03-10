import React, { useEffect, useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ride } from '@repo/api-client';
import { Car, Leaf } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Dashboard() {
  const { user, client } = useAuth();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      const myRides = await client.rides.getMine();
      setRides(myRides);
    } catch (e) {
      console.error("Failed to load rides:", e);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [client]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, [loadDashboardData]);

  if (isLoading && !refreshing) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
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
        <View style={[
          styles.banner, 
          { 
            backgroundColor: theme.primary, 
            paddingTop: insets.top + 20 
          }
        ]}>
          <View>
            <Text style={styles.bannerLabel}>DASHBOARD</Text>
            <Text style={styles.bannerTitle}>Welcome back,{"\n"}{user?.name?.split(' ')[0]}</Text>
            <View style={styles.carbonBadge}>
              <Leaf size={14} color="#000" />
              <Text style={styles.carbonText}>{user?.carbonSavedKg} kg saved</Text>
            </View>
          </View>
        </View>

        <View style={styles.mainContent}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Rides as Driver</Text>
          {rides.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Car size={32} color={theme.textMuted} />
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>No rides offered yet.</Text>
            </View>
          ) : (
            rides.map((ride) => (
              <View key={ride.id} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.locationRow}>
                    <Text style={[styles.locationText, { color: theme.text }]}>{ride.startLocation}</Text>
                    <Text style={{ color: theme.textMuted }}> → </Text>
                    <Text style={[styles.locationText, { color: theme.text }]}>{ride.endLocation}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: isDark ? 'rgba(190, 242, 100, 0.1)' : 'rgba(190, 242, 100, 0.2)' }]}>
                    <Text style={[styles.statusText, { color: isDark ? theme.primary : '#4d7c0f' }]}>{ride.status}</Text>
                  </View>
                </View>
                <Text style={[styles.cardSubtext, { color: theme.textMuted }]}>
                  {new Date(ride.departureDatetime).toLocaleDateString()} at {new Date(ride.departureDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                <View style={[styles.cardFooter, { borderTopColor: theme.border }]}>
                  <Text style={[styles.footerText, { color: theme.textMuted }]}>{ride.availableSeats} seats left</Text>
                  <Text style={[styles.footerTextBold, { color: theme.text }]}>{ride.bookings.length} Bookings</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  mainContent: {
    padding: 20,
  },
  banner: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 30,
    paddingBottom: 30,
    marginBottom: 10,
  },
  bannerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.5)',
    letterSpacing: 1,
    marginBottom: 5,
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    lineHeight: 34,
  },
  carbonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  carbonText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 15,
  },
  emptyState: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyText: {
    marginTop: 10,
    fontWeight: '500',
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
  },
  cardSubtext: {
    fontSize: 12,
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  footerText: {
    fontSize: 12,
  },
  footerTextBold: {
    fontSize: 12,
    fontWeight: '700',
  },
});
