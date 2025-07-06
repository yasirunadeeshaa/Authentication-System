import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAuth } from '../../src/AuthContext';
import Input from '../../src/components/Input';
import Button from '../../src/components/Button';

export default function VerifyScreen() {
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { user, verifyEmail, resendOTP, isLoading } = useAuth();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP code');
      return;
    }
    
    try {
      if (user?.email) {
        await verifyEmail(user.email, otp);
      } else {
        Alert.alert('Error', 'User email not found');
      }
    } catch (error: any) {
      Alert.alert(
        'Verification Failed',
        error.message || 'Invalid or expired OTP'
      );
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    try {
      if (user?.email) {
        await resendOTP(user.email);
        setCountdown(60);
        setCanResend(false);
        Alert.alert('Success', 'OTP resent successfully');
      } else {
        Alert.alert('Error', 'User email not found');
      }
    } catch (error: any) {
      Alert.alert(
        'Failed',
        error.message || 'Failed to resend OTP'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to {user?.email || 'your email'}
            </Text>
          </View>
          
          <View style={styles.form}>
            <Input
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter verification code"
              keyboardType="number-pad"
              maxLength={6}
              style={styles.otpInput}
            />
            
            <Button
              title="Verify"
              onPress={handleVerify}
              isLoading={isLoading}
              style={styles.button}
            />
            
            <View style={styles.resendContainer}>
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={!canResend}
              >
                <Text style={[
                  styles.resendText,
                  !canResend && styles.disabled
                ]}>
                  {canResend 
                    ? 'Resend OTP' 
                    : `Resend OTP in ${countdown}s`
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 10,
  },
  button: {
    marginTop: 20,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  resendText: {
    color: '#6200ee',
    fontSize: 16,
    fontWeight: '500',
  },
  disabled: {
    color: '#aaa',
  },
});