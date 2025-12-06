import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import COLORS from '../../theme/colors';

const Profile = ({ navigation }) => {
  const { user, logout, updateUser, deleteAccount } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    if (!user) {
      navigation.navigate('SignIn');
    } else {
      setNome(user.nome);
      setEmail(user.email);
    }
  }, [user, navigation]);

  const handleTakePhoto = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permissão negada', 'Precisamos de acesso à câmera para tirar sua foto de perfil.');
        return;
      }
    }
    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setProfileImage(photo.uri);
      setShowCamera(false);
    }
  };

  const handleUpdate = async () => {
    const updates = { nome, email };
    if (senha) {
      updates.senha = senha;
    }

    const result = await updateUser(updates);

    if (result.success) {
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      setSenha('');
      setIsEditing(false);
    } else {
      Alert.alert('Erro', result.error);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteAccount();
            if (result.success) {
              navigation.navigate('Main');
            } else {
              Alert.alert('Erro', result.error);
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Main');
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.errorText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  if (showCamera) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <CameraView style={styles.camera} ref={setCameraRef} facing="front">
          <View style={styles.cameraButtonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            <Button title="Cancelar" variant="secondary" onPress={() => setShowCamera(false)} />
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Meu Perfil</Text>

          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={handleTakePhoto}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>📷</Text>
                </View>
              )}
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Toque para tirar foto</Text>
          </View>

          {!isEditing ? (
            <>
              <View style={styles.infoSection}>
                <Text style={styles.label}>Nome</Text>
                <Text style={styles.value}>{user.nome}</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{user.email}</Text>
              </View>

              <Button title="Editar Perfil" onPress={() => setIsEditing(true)} fullWidth />
              <Button title="Sair" variant="secondary" onPress={handleLogout} fullWidth />
              <Button title="Excluir Conta" variant="secondary" onPress={handleDelete} fullWidth />
            </>
          ) : (
            <>
              <Input
                placeholder="Nome completo"
                value={nome}
                onChangeText={setNome}
              />
              <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              <Input
                placeholder="Nova senha (opcional)"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />

              <Button title="Salvar Alterações" onPress={handleUpdate} fullWidth />
              <Button
                title="Cancelar"
                variant="secondary"
                onPress={() => {
                  setIsEditing(false);
                  setNome(user.nome);
                  setEmail(user.email);
                  setSenha('');
                }}
                fullWidth
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_COLOR,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.TEXT_COLOR,
    textAlign: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_COLOR,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderWidth: 3,
    borderColor: COLORS.PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
  },
  avatarHint: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.PRIMARY_COLOR,
  },
  camera: {
    flex: 1,
  },
  cameraButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
    gap: 20,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.PRIMARY_COLOR,
  },
  infoSection: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.BORDER_COLOR,
  },
  label: {
    fontSize: 14,
    color: COLORS.PRIMARY_COLOR,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: COLORS.TEXT_COLOR,
  },
  errorText: {
    color: COLORS.TEXT_COLOR,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});

export default Profile;
