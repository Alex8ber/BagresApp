/**
 * DeadlineManager Component
 * 
 * A reusable component for managing quiz availability dates and times.
 * Provides date and time pickers for available_from and available_until fields.
 * Validates that available_until is after available_from.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/styles/theme';

// ============================================================================
// Types
// ============================================================================

export interface DeadlineManagerProps {
  availableFrom: string | null;
  availableUntil: string | null;
  onChangeFrom: (date: string) => void;
  onChangeUntil: (date: string) => void;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

// ============================================================================
// Component
// ============================================================================

export const DeadlineManager: React.FC<DeadlineManagerProps> = ({
  availableFrom,
  availableUntil,
  onChangeFrom,
  onChangeUntil,
  error,
  containerStyle,
}) => {
  const [showFromPicker, setShowFromPicker] = React.useState(false);
  const [showUntilPicker, setShowUntilPicker] = React.useState(false);

  const fromDate = availableFrom ? new Date(availableFrom) : new Date();
  const untilDate = availableUntil ? new Date(availableUntil) : new Date();

  const handleFromChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowFromPicker(false);
    }
    
    if (selectedDate) {
      onChangeFrom(selectedDate.toISOString());
    }
  };

  const handleUntilChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowUntilPicker(false);
    }
    
    if (selectedDate) {
      onChangeUntil(selectedDate.toISOString());
    }
  };

  const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return 'No establecido';
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Available From */}
      <View style={styles.dateSection}>
        <Text style={styles.label}>Disponible desde</Text>
        <TouchableOpacity
          style={[styles.dateButton, !availableFrom && styles.dateButtonEmpty]}
          onPress={() => setShowFromPicker(true)}
          activeOpacity={theme.opacity.pressed}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={availableFrom ? theme.colors.teacher.main : theme.colors.text.secondary}
          />
          <Text
            style={[
              styles.dateText,
              !availableFrom && styles.dateTextEmpty,
            ]}
          >
            {formatDateTime(availableFrom)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Available Until */}
      <View style={styles.dateSection}>
        <Text style={styles.label}>Disponible hasta</Text>
        <TouchableOpacity
          style={[styles.dateButton, !availableUntil && styles.dateButtonEmpty]}
          onPress={() => setShowUntilPicker(true)}
          activeOpacity={theme.opacity.pressed}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={availableUntil ? theme.colors.teacher.main : theme.colors.text.secondary}
          />
          <Text
            style={[
              styles.dateText,
              !availableUntil && styles.dateTextEmpty,
            ]}
          >
            {formatDateTime(availableUntil)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color={theme.colors.error.main} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Date Pickers */}
      {showFromPicker && (
        <DateTimePicker
          value={fromDate}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleFromChange}
          locale="es-ES"
        />
      )}

      {showUntilPicker && (
        <DateTimePicker
          value={untilDate}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleUntilChange}
          locale="es-ES"
          minimumDate={availableFrom ? new Date(availableFrom) : undefined}
        />
      )}
    </View>
  );
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },

  dateSection: {
    gap: theme.spacing.sm,
  },

  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },

  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.teacher.main,
    backgroundColor: theme.colors.background.primary,
  },

  dateButtonEmpty: {
    borderColor: theme.colors.border.main,
    borderStyle: 'dashed',
  },

  dateText: {
    flex: 1,
    fontSize: theme.fontSize.base,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },

  dateTextEmpty: {
    color: theme.colors.text.secondary,
  },

  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.error.light,
  },

  errorText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.error.dark,
    fontWeight: '500',
  },
});

export default DeadlineManager;
