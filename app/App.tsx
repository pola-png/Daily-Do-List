import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FilterType, Task } from './src/types/task';
import { loadTasks, saveTasks } from './src/storage/taskStorage';
import { TaskItem } from './src/components/TaskItem';
import { PrivacyModal } from './src/components/PrivacyModal';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
];

function DailyDoListScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [privacyVisible, setPrivacyVisible] = useState(false);

  useEffect(() => {
    loadTasks().then((initial) => {
      setTasks(initial);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      saveTasks(tasks);
    }
  }, [tasks, loaded]);

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const remainingCount = useMemo(
    () => tasks.filter((t) => !t.completed).length,
    [tasks]
  );

  const completedCount = tasks.length - remainingCount;

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.completed);
    if (filter === 'completed') return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, filter]);

  const handleAddTask = () => {
    const trimmed = newTaskTitle.trim();
    if (!trimmed) return;

    const now = Date.now();
    const nextTask: Task = {
      id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
      title: trimmed,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [nextTask, ...prev]);
    setNewTaskTitle('');
  };

  const handleToggleTask = (id: string) => {
    const now = Date.now();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, updatedAt: now } : t
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
  };

  const handleSaveEdit = () => {
    if (!editingTask) return;
    const trimmed = editTitle.trim();
    if (!trimmed) {
      Alert.alert('Empty task', 'Please enter a task title.');
      return;
    }
    const now = Date.now();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingTask.id ? { ...t, title: trimmed, updatedAt: now } : t
      )
    );
    setEditingTask(null);
    setEditTitle('');
  };

  const handleClearCompleted = () => {
    if (completedCount === 0) return;
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.dateText}>{todayLabel}</Text>
            <Text style={styles.headerTitle}>Daily Do List</Text>
            <Text style={styles.subtitle}>
              {remainingCount} {remainingCount === 1 ? 'task' : 'tasks'} remaining
            </Text>
          </View>
          <TouchableOpacity
            style={styles.privacyBtn}
            onPress={() => setPrivacyVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Privacy Policy and App Info"
          >
            <Ionicons name="shield-checkmark-outline" size={22} color="#2563EB" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add a task for today..."
            placeholderTextColor="#94A3B8"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={handleAddTask}
            returnKeyType="done"
            maxLength={160}
          />
          <TouchableOpacity
            style={[
              styles.addBtn,
              !newTaskTitle.trim() && styles.addBtnDisabled,
            ]}
            onPress={handleAddTask}
            disabled={!newTaskTitle.trim()}
            accessibilityRole="button"
            accessibilityLabel="Add task"
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterBar}>
          <View style={styles.filterPills}>
            {FILTERS.map((item) => {
              const active = filter === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => setFilter(item.key)}
                >
                  <Text style={[styles.pillText, active && styles.pillTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {completedCount > 0 && (
            <TouchableOpacity onPress={handleClearCompleted}>
              <Text style={styles.clearText}>Clear done</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={
            filteredTasks.length === 0 ? styles.emptyContainer : styles.listContent
          }
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={handleToggleTask}
              onEdit={openEditModal}
              onDelete={handleDeleteTask}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="checkmark-done-circle-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>
                {filter === 'completed'
                  ? 'No completed tasks yet'
                  : filter === 'active'
                  ? 'All caught up!'
                  : 'No tasks for today'}
              </Text>
              <Text style={styles.emptyHint}>
                {filter === 'all'
                  ? 'Add a task above to get started.'
                  : 'Switch filters or add a new task.'}
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>

      <Modal
        visible={editingTask !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingTask(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Task</Text>
            <TextInput
              style={styles.modalInput}
              value={editTitle}
              onChangeText={setEditTitle}
              autoFocus
              maxLength={160}
              onSubmitEditing={handleSaveEdit}
              returnKeyType="done"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setEditingTask(null)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <PrivacyModal
        visible={privacyVisible}
        onClose={() => setPrivacyVisible(false)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <DailyDoListScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  privacyBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 16,
    color: '#0F172A',
  },
  addBtn: {
    width: 50,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    backgroundColor: '#93C5FD',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  filterPills: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  pillActive: {
    backgroundColor: '#0F172A',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#EF4444',
  },
  listContent: {
    paddingBottom: 28,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 60,
  },
  emptyBox: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#334155',
    marginTop: 10,
  },
  emptyHint: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    color: '#475569',
    fontWeight: '600',
  },
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#2563EB',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
