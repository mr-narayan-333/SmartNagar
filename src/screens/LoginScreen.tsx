import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OfficialServiceBadge } from '@/components/brand/OfficialServiceBadge';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { TextField } from '@/components/ui/TextField';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

function notify(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
}

export function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  function handleGetOtp() {
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      notify('Invalid number', 'Enter a 10-digit mobile number to receive an OTP.');
      return;
    }
    setOtpSent(true);
    setOtp((current) => (current.length >= 4 ? current : '1234'));
  }

  function handleLogin() {
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      notify('Invalid number', 'Enter a 10-digit mobile number.');
      return;
    }

    if (!otpSent) {
      notify('OTP required', 'Tap Get OTP, then enter the code to continue.');
      return;
    }

    const code = otp.replace(/\D/g, '');
    if (code.length < 4) {
      notify('Enter OTP', 'Enter the 4–6 digit OTP sent to your mobile number.');
      return;
    }

    router.replace('/home');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.blobPrimary} />
          <View style={styles.blobSecondary} />

          <View style={styles.brand}>
            <View style={styles.logoMark}>
              <MaterialIcons color={colors.primary} name="account-balance" size={40} />
            </View>
            <Text style={styles.brandTitle}>SmartNagar</Text>
            <Text style={styles.brandTagline}>Report. Track. Resolve.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.welcome}>Welcome Back</Text>

            <View style={styles.form}>
              <TextField
                autoComplete="tel"
                keyboardType="phone-pad"
                label="Mobile Number"
                leftIcon="phone-iphone"
                maxLength={10}
                placeholder="Enter 10-digit number"
                prefix="+91"
                rightAccessory={
                  <Pressable hitSlop={8} onPress={handleGetOtp}>
                    <Text style={styles.getOtp}>{otpSent ? 'Resend' : 'Get OTP'}</Text>
                  </Pressable>
                }
                value={phone}
                onChangeText={(value) => setPhone(value.replace(/\D/g, '').slice(0, 10))}
              />

              {otpSent ? (
                <TextField
                  keyboardType="number-pad"
                  label="OTP"
                  leftIcon="lock-outline"
                  maxLength={6}
                  placeholder="Enter OTP"
                  value={otp}
                  onChangeText={(value) => setOtp(value.replace(/\D/g, '').slice(0, 6))}
                />
              ) : null}

              <Checkbox
                checked={rememberMe}
                label="Remember me securely"
                onChange={setRememberMe}
              />

              <View style={styles.actions}>
                <Button icon="arrow-forward" label="Login" onPress={handleLogin} />

                <View style={styles.dividerRow}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerLabel}>OR</Text>
                  <View style={styles.divider} />
                </View>

                <Button
                  icon="person-add"
                  label="Sign Up"
                  variant="outline"
                  onPress={() => router.push('/register')}
                />
              </View>
            </View>

            <Text style={styles.legal}>
              By proceeding, you agree to the <Text style={styles.legalLink}>Terms of Service</Text>{' '}
              & <Text style={styles.legalLink}>Privacy Policy</Text> of SmartNagar.
            </Text>
          </View>

          <View style={styles.badgeWrap}>
            <OfficialServiceBadge />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.containerPadding,
    paddingTop: spacing.stackMd,
    paddingBottom: spacing.stackLg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blobPrimary: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.primaryTint,
    pointerEvents: 'none',
  },
  blobSecondary: {
    position: 'absolute',
    bottom: -60,
    right: -70,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.secondaryTint,
    pointerEvents: 'none',
  },
  brand: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.stackLg,
  },
  logoMark: {
    width: 80,
    height: 80,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.stackSm,
  },
  brandTitle: {
    ...typography.headlineLgMobile,
    color: colors.primary,
    marginBottom: spacing.base,
    textAlign: 'center',
  },
  brandTagline: {
    ...typography.bodyLg,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 448,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.xl,
    padding: spacing.stackMd,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
      default: { boxShadow: '0px 1px 4px rgba(0,0,0,0.06)' },
    }),
  },
  welcome: {
    ...typography.headlineLg,
    color: colors.onBackground,
    textAlign: 'center',
    marginBottom: spacing.stackMd,
  },
  form: {
    gap: spacing.stackSm,
  },
  getOtp: {
    ...typography.labelSm,
    color: colors.primary,
  },
  actions: {
    marginTop: spacing.stackMd,
    gap: spacing.stackSm,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.outlineVariant,
  },
  dividerLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  legal: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.stackMd,
    paddingHorizontal: 12,
  },
  legalLink: {
    ...typography.labelSm,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  badgeWrap: {
    marginTop: spacing.stackLg,
  },
});
