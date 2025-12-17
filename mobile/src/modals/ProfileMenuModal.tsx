import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import {fontFamilies} from '../constants/fontFamilies';
import { appColors } from '../constants/appColors';

export interface MenuItem {
  icon: string | React.ReactNode;
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
          <View style={styles.header}>
            <View style={styles.handle} />
          </View>

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
    backgroundColor: appColors.white,
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
    backgroundColor: appColors.gray7,
    borderRadius: 2,
  },
  menuContainer: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: appColors.gray6,
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
    color: appColors.text,
    flex: 1,
  },
});

export default ProfileMenuModal;
