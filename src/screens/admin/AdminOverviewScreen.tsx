import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { getAdminStats, getRecentActivity, getPendingTeachers } from '@/services/supabase/admin';

export default function AdminOverviewScreen() {
  const { profile, signOut } = useAuth();
  const [stats, setStats] = React.useState<any | null>(null);
  const [activity, setActivity] = React.useState<any | null>(null);
  const [pendingTeachers, setPendingTeachers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Control</Text>
        <Text style={styles.subtitle}>Bienvenido, {profile?.fullName}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Estadísticas</Text>
          {loading && <Text>Cargando...</Text>}
          {!loading && stats && (
            <View>
              <Text>Total profesores: {stats.teachers}</Text>
              <Text>Total estudiantes: {stats.students}</Text>
              <Text>Total clases: {stats.classes}</Text>
              <Text>Total materiales: {stats.materials}</Text>
              <Text>Total quizzes: {stats.quizzes}</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Actividad reciente</Text>
          {!activity && <Text>Cargando...</Text>}
          {activity && (
            <View>
              <Text style={{fontWeight: 'bold', marginTop: 6}}>Últimas entregas</Text>
              {activity.submissions?.slice(0,5).map((s: any) => (
                <Text key={s.id}>{s.students?.full_name || 'Anon'} — {s.quizzes?.title || 'Quiz'} ({new Date(s.submitted_at).toLocaleString()})</Text>
              ))}

              <Text style={{fontWeight: 'bold', marginTop: 8}}>Nuevos profesores</Text>
              {activity.newTeachers?.slice(0,5).map((t: any) => (
                <Text key={t.id}>{t.full_name} — {t.email}</Text>
              ))}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profesores pendientes</Text>
          {pendingTeachers.length === 0 ? (
            <Text>No hay profesores pendientes.</Text>
          ) : (
            pendingTeachers.slice(0,5).map((p) => (
              <View key={p.id} style={{marginBottom:6}}>
                <Text>{p.full_name} — {p.email}</Text>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
  // Load data
  React.useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [s, a, p] = await Promise.all([getAdminStats(), getRecentActivity(), getPendingTeachers()]);
        if (!mounted) return;
        setStats(s);
        setActivity(a);
        setPendingTeachers(p);
      } catch (err) {
        // ignore - UI will show empty state
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#ddd',
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
