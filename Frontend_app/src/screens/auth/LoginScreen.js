import React, { useState } from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  ActivityIndicator,
  Button,
  Checkbox,
  TextInput,
} from 'react-native-paper';

import Ionicons from '@react-native-vector-icons/ionicons';
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../utils/config';
import { loginUser } from '../../api/userService';

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Email Required',
        text2: 'Please enter your email.',
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email.',
      });
      return false;
    }

    if (!password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Password Required',
        text2: 'Please enter your password.',
      });
      return false;
    }

    return true;
  };

  const handleSignIn = async () => {
    if (isLoading) return;

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const response = await loginUser(
        email.trim().toLowerCase(),
        password
      );

      if (!response.success) {
        throw new Error(response.message || 'Login failed');
      }

      const { token, user } = response.data;

      await AsyncStorage.multiSet([
        [config.KEY_TOKEN, token],
        ['user', JSON.stringify(user)],
        [
          config.KEY_REMEMBER_ME,
          rememberMe ? 'true' : 'false',
        ],
      ]);

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: `Welcome ${user.name ?? ''}`,
      });

      switch (user.role) {
        case 'candidate':
          navigation.replace('Home');
          break;

        case 'recruiter':
          navigation.replace('RecruiterHome');
          break;

        case 'admin':
          navigation.replace('AdminHome');
          break;

        default:
          navigation.replace('Login');
      }
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2:
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    Toast.show({
      type: 'info',
      text1: 'Forgot Password',
      text2: 'This feature will be implemented soon.',
    });
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#5B5FEF"
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons
                name="document-text-outline"
                size={52}
                color="#FFFFFF"
              />

              <View style={styles.sparkleContainer}>
                <Ionicons
                  name="sparkles"
                  size={21}
                  color="#FFE066"
                />
              </View>
            </View>

            <Text style={styles.appTitle}>
              AI Resume Analyzer
            </Text>

            <Text style={styles.appSubtitle}>
              Improve your resume and increase your chances
            </Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.loginCard}>
              <Text style={styles.welcomeTitle}>
                Welcome Back
              </Text>

              <Text style={styles.welcomeSubtitle}>
                Sign in to continue to your account
              </Text>

              <TextInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                placeholder="Enter your email address"
                outlineColor="#DDE1EC"
                activeOutlineColor="#5B5FEF"
                textColor="#172033"
                style={styles.input}
                contentStyle={styles.inputContent}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <Ionicons
                        name="mail-outline"
                        size={21}
                        color="#6F7687"
                      />
                    )}
                  />
                }
                theme={{
                  roundness: 14,
                  colors: {
                    background: '#F8F9FD',
                  },
                }}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                placeholder="Enter your password"
                outlineColor="#DDE1EC"
                activeOutlineColor="#5B5FEF"
                textColor="#172033"
                style={styles.input}
                contentStyle={styles.inputContent}
                onSubmitEditing={handleSignIn}
                left={
                  <TextInput.Icon
                    icon={() => (
                      <Ionicons
                        name="lock-closed-outline"
                        size={21}
                        color="#6F7687"
                      />
                    )}
                  />
                }
                right={
                  <TextInput.Icon
                    icon={() => (
                      <Ionicons
                        name={
                          showPassword
                            ? 'eye-off-outline'
                            : 'eye-outline'
                        }
                        size={22}
                        color="#6F7687"
                      />
                    )}
                    onPress={() =>
                      setShowPassword(previous => !previous)
                    }
                  />
                }
                theme={{
                  roundness: 14,
                  colors: {
                    background: '#F8F9FD',
                  },
                }}
              />

              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.rememberContainer}
                  onPress={() => setRememberMe(previous => !previous)}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <Checkbox
                    status={rememberMe ? 'checked' : 'unchecked'}
                    onPress={() =>
                      setRememberMe(previous => !previous)
                    }
                    color="#5B5FEF"
                    uncheckedColor="#7C8393"
                    disabled={isLoading}
                  />

                  <Text style={styles.rememberText}>
                    Remember me
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleForgotPassword}
                  disabled={isLoading}
                >
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              <Button
                mode="contained"
                onPress={handleSignIn}
                disabled={isLoading}
                buttonColor="#5B5FEF"
                textColor="#FFFFFF"
                style={styles.signInButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.signInButtonText}
              >
                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                ) : (
                  'SIGN IN'
                )}
              </Button>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />

                <Text style={styles.dividerText}>
                  OR
                </Text>

                <View style={styles.dividerLine} />
              </View>

              <Button
                mode="outlined"
                onPress={handleSignUp}
                disabled={isLoading}
                textColor="#5B5FEF"
                style={styles.signUpButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.signUpButtonText}
                icon={() => (
                  <Ionicons
                    name="person-add-outline"
                    size={20}
                    color="#5B5FEF"
                  />
                )}
              >
                CREATE AN ACCOUNT
              </Button>
            </View>

            <Text style={styles.roleText}>
              Candidate
              <Text style={styles.dotText}> • </Text>
              Recruiter
            </Text>

            <Text style={styles.footerText}>
              Analyse resumes and discover better opportunities
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F5F7FF',
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#F5F7FF',
  },

  header: {
    minHeight: 300,
    backgroundColor: '#5B5FEF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 35,
    paddingBottom: 75,
    borderBottomLeftRadius: 42,
    borderBottomRightRadius: 42,
  },

  logoContainer: {
    width: 92,
    height: 92,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  sparkleContainer: {
    position: 'absolute',
    top: 9,
    right: 9,
  },

  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  appSubtitle: {
    fontSize: 14,
    color: '#E6E7FF',
    textAlign: 'center',
    marginTop: 9,
    lineHeight: 21,
  },

  formSection: {
    flex: 1,
    paddingHorizontal: 19,
    paddingBottom: 30,
    marginTop: -50,
  },

  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 21,
    paddingTop: 28,
    paddingBottom: 25,
    shadowColor: '#1E245F',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 8,
  },

  welcomeTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#172033',
    textAlign: 'center',
  },

  welcomeSubtitle: {
    fontSize: 14,
    color: '#7A8194',
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 24,
  },

  input: {
    backgroundColor: '#F8F9FD',
    marginBottom: 17,
    fontSize: 15,
  },

  inputContent: {
    minHeight: 55,
  },

  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -7,
    marginBottom: 21,
  },

  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -9,
  },

  rememberText: {
    fontSize: 14,
    color: '#4C5363',
    marginLeft: -4,
  },

  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5B5FEF',
  },

  signInButton: {
    borderRadius: 14,
    shadowColor: '#5B5FEF',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },

  buttonContent: {
    height: 56,
  },

  signInButtonText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E4EC',
  },

  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999FAD',
    marginHorizontal: 12,
  },

  signUpButton: {
    borderRadius: 14,
    borderWidth: 1.4,
    borderColor: '#5B5FEF',
  },

  signUpButtonText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#687083',
    textAlign: 'center',
    marginTop: 23,
  },

  dotText: {
    color: '#5B5FEF',
  },

  footerText: {
    fontSize: 12,
    color: '#969CAB',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default LoginScreen;