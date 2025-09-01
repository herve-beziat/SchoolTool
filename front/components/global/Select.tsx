import React, { useMemo, useRef, useState } from 'react';
import {
  Platform,
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Modal,
  LayoutChangeEvent,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export type SelectOption =
  | string
  | {
      value: string;
      label: string;
    };

type Props = {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  includeAll?: boolean;
  allValue?: string;
};

const UnitSelect: React.FC<Props> = ({
  value,
  onChange,
  options,
  placeholder = 'Toutes les units',
  includeAll = false,
  allValue = 'All',
}) => {
  const normalized = useMemo(() => {
    const arr =
      options.length && typeof options[0] === 'string'
        ? (options as string[]).map((s) => ({ value: s, label: s }))
        : (options as { value: string; label: string }[]);
    return includeAll ? [{ value: allValue, label: placeholder }, ...arr] : arr;
  }, [options, includeAll, allValue, placeholder]);

  const labelFor = (v: string) =>
    normalized.find((o) => o.value === v)?.label ?? v;

  // --- iOS/Android: Picker natif
  if (Platform.OS !== 'web') {
    return (
      <View style={{ width: '100%' }}>
        <Picker selectedValue={value} onValueChange={onChange}>
          {normalized.map((o) => (
            <Picker.Item key={o.value} label={o.label} value={o.value} />
          ))}
        </Picker>
      </View>
    );
  }

  // --- Web: dropdown ancré SOUS le trigger
  const [open, setOpen] = useState(false);
  const [triggerBox, setTriggerBox] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({ x: 0, y: 0, width: 0, height: 0 });

  const onTriggerLayout = (e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    setTriggerBox({ x, y, width, height });
  };

  return (
    <View style={{ width: '100%', position: 'relative' }}>
      <Pressable
        onLayout={onTriggerLayout}
        onPress={() => setOpen(true)}
        style={styles.trigger}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Text style={styles.triggerText} numberOfLines={1}>
          {labelFor(value)}
        </Text>
        <Text style={styles.caret}>▾</Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View
            style={[
              styles.menuWrapper,
              {
                left: triggerBox.x,
                top: triggerBox.y + triggerBox.height + 6,
                width: Math.max(triggerBox.width, 220),
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.menu}>
              <Text style={styles.menuTitle}>{placeholder}</Text>
              <View style={styles.menuList}>
                {normalized.map((opt) => {
                  const active = value === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      onPress={() => {
                        onChange(opt.value);
                        setOpen(false);
                      }}
                      style={[styles.item, active && styles.itemActive]}
                      accessibilityRole="menuitem"
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.itemText,
                          active && styles.itemTextActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
    minHeight: 36,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  triggerText: {
    flex: 1,
    fontSize: 14,
    color: '#111',
    paddingVertical: 8,
  },
  caret: { marginLeft: 8, fontSize: 14, opacity: 0.7 },

  overlay: { flex: 1, backgroundColor: 'transparent' },
  menuWrapper: { position: 'absolute' },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  menuTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#111',
    marginBottom: 6,
  },
  menuList: { maxHeight: 360 },
  item: { paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8 },
  itemActive: { backgroundColor: '#e8f1ff' },
  itemText: { fontSize: 14, color: '#111' },
  itemTextActive: { fontWeight: '600', color: '#0b62e0' },
});

export default UnitSelect;
