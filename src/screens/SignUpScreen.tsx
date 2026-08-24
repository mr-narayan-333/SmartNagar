import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
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

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { TextField } from '@/components/ui/TextField';
import { colors } from '@/theme/colors';
import { radii, spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

const WARDS = [
  { value: 'ward1', label: 'Ward 1 - Central Market' },
  { value: 'ward2', label: 'Ward 2 - Station Road' },
  { value: 'ward3', label: 'Ward 3 - Civil Lines' },
  { value: 'ward4', label: 'Ward 4 - Gandhi Nagar' },
] as const;

export function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [wardFocused, setWardFocused] = useState(false);

  function handleCreateAccount() {
    const name = fullName.trim();
    const digits = phone.replace(/\D/g, '');

    if (!name) {
      Alert.alert('Full name required', 'Enter your full name to continue.');
      return;
    }
    if (digits.length !== 10) {
      Alert.alert('Invalid number', 'Enter a 10-digit mobile number.');
      return;
    }
    if (!ward) {
      Alert.alert('Ward required', 'Select your ward / area.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Password too short', 'Password must be at least 8 characters.');
      return;
    }
    if (!agreedToTerms) {
      Alert.alert('Terms required', 'Agree to the Terms of Service and Privacy Policy to continue.');
      return;
    }

    router.replace('/home');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <MaterialIcons color={colors.primary} name="account-balance" size={24} />
        <Text style={styles.headerTitle}>SmartNagar</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.accent} />

            <View style={styles.intro}>
              <View style={styles.logoMark}>
                <MaterialIcons color={colors.primary} name="account-balance" size={32} />
              </View>
              <Text style={styles.title}>Create an Account</Text>
              <Text style={styles.subtitle}>
                Join SmartNagar to participate in civic governance and access municipal services.
              </Text>
            </View>

            <View style={styles.form}>
              <TextField
                autoCapitalize="words"
                autoComplete="name"
                label="Full Name"
                leftIcon="person"
                placeholder="e.g. Ramesh Kumar"
                value={fullName}
                onChangeText={setFullName}
              />

              <TextField
                autoComplete="tel"
                keyboardType="phone-pad"
                label="Phone Number"
                maxLength={10}
                placeholder="9876543210"
                prefix="+91"
                value={phone}
                onChangeText={(value) => setPhone(value.replace(/\D/g, '').slice(0, 10))}
              />

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Ward / Area</Text>
                <View style={[styles.pickerField, wardFocused && styles.pickerFieldFocused]}>
                  <MaterialIcons color={colors.outline} name="location-on" size={22} />
                  <Picker
                    dropdownIconColor={colors.outline}
                    mode="dropdown"
                    selectedValue={ward}
                    style={styles.picker}
                    onBlur={() => setWardFocused(false)}
                    onFocus={() => setWardFocused(true)}
                    onValueChange={(value) => setWard(String(value))}>
                    <Picker.Item
                      color={colors.outline}
                      enabled={false}
                      label="Select your ward..."
                      value=""
                    />
                    {WARDS.map((item) => (
                      <Picker.Item
                        color={colors.onSurface}
                        key={item.value}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View>
                <TextField
                  autoComplete="new-password"
                  label="Password"
                  leftIcon="lock-outline"
                  placeholder="••••••••"
                  secureTextEntry={!showPassword}
                  textContentType="newPassword"
                  value={password}
                  rightAccessory={
                    <Pressable
                      accessibilityLabel="Toggle password visibility"
                      hitSlop={8}
                      onPress={() => setShowPassword((visible) => !visible)}>
                      <MaterialIcons
                        color={colors.outline}
                        name={showPassword ? 'visibility' : 'visibility-off'}
                        size={22}
                      />
                    </Pressable>
                  }
                  onChangeText={setPassword}
                />
                <Text style={styles.hint}>Must be at least 8 characters.</Text>
              </View>

              <Checkbox
                checked={agreedToTerms}
                label={
                  <Text style={styles.terms}>
                    I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>.
                  </Text>
                }
                onChange={setAgreedToTerms}
              />

              <Button
                icon="arrow-forward"
                label="Create Account"
                style={styles.submit}
                onPress={handleCreateAccount}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text style={styles.footerLink} onPress={() => router.replace('/')}>
                  Login
                </Text>
              </Text>
            </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    ...typography.headlineMd,
    color: colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.containerPadding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 448,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.md,
    padding: spacing.stackMd,
    overflow: 'hidden',
    position: 'relative',
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.primaryContainer,
  },
  intro: {
    alignItems: 'center',
    marginBottom: spacing.stackMd,
    paddingTop: spacing.base,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: spacing.base,
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  pickerField: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceContainerLowest,
    overflow: 'hidden',
  },
  pickerFieldFocused: {
    borderColor: colors.primaryContainer,
  },
  picker: {
    flex: 1,
    color: colors.onSurface,
    backgroundColor: 'transparent',
  },
  hint: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  terms: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  termsLink: {
    ...typography.bodyMd,
    color: colors.primaryContainer,
    textDecorationLine: 'underline',
  },
  submit: {
    marginTop: 8,
  },
  footer: {
    marginTop: spacing.stackMd,
    paddingTop: spacing.stackSm,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    alignItems: 'center',
  },
  footerText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  footerLink: {
    ...typography.bodyMd,
    color: colors.primaryContainer,
    textDecorationLine: 'underline',
  },
});
