import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import {fontFamilies} from '../constants/fontFamilies';

interface MenuItem {
  icon: string;
  title: string;
  onPress: () => void;
}

interface ProfileMenuModalProps {
  visible: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

const ProfileMenuModal = ({
  visible,
  onClose,
  menuItems,
}: ProfileMenuModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.handle} />
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Công cụ chuyên nghiệp</Text>
          </View>

          {/* Menu Items */}
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  item.onPress();
                  onClose();
                }}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
  },
  header: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#48484a',
    borderRadius: 2,
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  title: {
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
    color: '#ffffff',
  },
  menuContainer: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2c2c2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 20,
  },
  menuText: {
    fontSize: 16,
    fontFamily: fontFamilies.regular,
    color: '#ffffff',
    flex: 1,
  },
});

export default ProfileMenuModal;
