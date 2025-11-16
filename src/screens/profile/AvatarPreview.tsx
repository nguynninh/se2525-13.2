import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {appColors} from '../../constants/appColors';
import {fontFamilies} from '../../constants/fontFamilies';

const AvatarPreview = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {imageUri} = route.params as {imageUri: string};
  const [visibility, setVisibility] = useState('Công khai');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xem trước ảnh đại diện</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Lưu</Text>
        </TouchableOpacity>
      </View>

      {/* Visibility Section */}
      <View style={styles.visibilitySection}>
        <Text style={styles.visibilityLabel}>Đến: 🌐 {visibility}</Text>
      </View>

      {/* Caption Input */}
      <View style={styles.captionSection}>
        <Text style={styles.captionPlaceholder}>
          Hãy nói gì đó về ảnh đại diện của bạn
        </Text>
      </View>

      {/* Image Preview */}
      <View style={styles.imageContainer}>
        <Image source={{uri: imageUri}} style={styles.image} />
        
        {/* Camera Button */}
        <TouchableOpacity style={styles.cameraButton}>
          <View style={styles.cameraIcon}>
            <Text style={styles.cameraIconText}>📷</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>✂️</Text>
          <Text style={styles.actionText}>Chỉnh sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🖼️</Text>
          <Text style={styles.actionText}>Khung</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>⏰</Text>
          <Text style={styles.actionText}>Đề tạm thời</Text>
        </TouchableOpacity>
      </View>

      {/* Share to Feed */}
      <View style={styles.shareSection}>
        <Text style={styles.shareText}>
          Chia sẻ thông tin mới lên Bảng feed
        </Text>
        <TouchableOpacity style={styles.checkbox}>
          <View style={styles.checkboxInner} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerButton: {
    padding: 8,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fontFamilies.regular,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
  },
  visibilitySection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  visibilityLabel: {
    color: '#999',
    fontSize: 14,
    fontFamily: fontFamilies.regular,
  },
  captionSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  captionPlaceholder: {
    color: '#666',
    fontSize: 14,
    fontFamily: fontFamilies.regular,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 300,
    resizeMode: 'cover',
  },
  cameraButton: {
    position: 'absolute',
    right: 40,
    bottom: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIconText: {
    fontSize: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: fontFamilies.regular,
  },
  shareSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  shareText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: fontFamilies.regular,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
});

export default AvatarPreview;
