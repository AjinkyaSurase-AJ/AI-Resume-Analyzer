import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function FormField({
  label,
  placeholder,
  multiline,
  secureTextEntry,
  value,
  onChangeText,
  keyboardType,
}) {
  const isMultiline = Boolean(multiline);
  const isSecure = Boolean(secureTextEntry);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isMultiline && styles.multilineInput]}
        placeholder={placeholder}
        placeholderTextColor="#7A8194"
        secureTextEntry={isSecure}
        multiline={isMultiline}
        value={value || ''}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '800',
    color: '#172033',
  },
  input: {
    minHeight: 52,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 15,
    color: '#172033',
  },
  multilineInput: {
    minHeight: 120,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
});
