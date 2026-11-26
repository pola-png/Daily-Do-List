import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

/**
 * Renders a single daily task row with toggle, edit, and delete actions.
 */
export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.mainArea}
        onPress={() => onToggle(task.id)}
        activeOpacity={0.7}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
        accessibilityLabel={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
      >
        <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
          {task.completed && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
        </View>
        <Text
          style={[styles.title, task.completed && styles.titleDone]}
          numberOfLines={3}
        >
          {task.title}
        </Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => onEdit(task)}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel={`Edit "${task.title}"`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="pencil-outline" size={18} color="#475569" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(task.id)}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel={`Delete "${task.title}"`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  mainArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    lineHeight: 22,
  },
  titleDone: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
});
