import DateTimePicker from '@react-native-community/datetimepicker';

import {
  useState,
} from 'react';

import {
  Pressable,
  Text,
  View,
} from 'react-native';

import {
  commonStyles,
} from '../styles/common.styles';

import {
  createChoreStyles,
} from '../styles/screens/create-chore.styles';

type DueDateTimePickerProps = {
  dueDate: string;
  dueTime: string;

  onDateChange: (
    value: string
  ) => void;

  onTimeChange: (
    value: string
  ) => void;
};

export function DueDateTimePicker({
  dueDate,
  dueTime,
  onDateChange,
  onTimeChange,
}: DueDateTimePickerProps) {
  const [
    showDatePicker,
    setShowDatePicker,
  ] = useState(false);

  const [
    showTimePicker,
    setShowTimePicker,
  ] = useState(false);

  const formatDateForStorage = (
    date: Date
  ) => {
    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        date.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const formatTimeForStorage = (
    date: Date
  ) => {
    const hours =
      String(
        date.getHours()
      ).padStart(2, '0');

    const minutes =
      String(
        date.getMinutes()
      ).padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  const getCurrentDateValue =
    () => {
      if (!dueDate) {
        return new Date();
      }

      const [
        year,
        month,
        day,
      ] = dueDate
        .split('-')
        .map(Number);

      return new Date(
        year,
        month - 1,
        day
      );
    };

  const getCurrentTimeValue =
    () => {
      const date =
        new Date();

      if (!dueTime) {
        /*
         * Default to 6pm.
         */
        date.setHours(
          18,
          0,
          0,
          0
        );

        return date;
      }

      const [
        hours,
        minutes,
      ] = dueTime
        .split(':')
        .map(Number);

      date.setHours(
        hours,
        minutes,
        0,
        0
      );

      return date;
    };

  const getReadableDate =
    () => {
      if (!dueDate) {
        return 'Choose date';
      }

      const [
        year,
        month,
        day,
      ] = dueDate
        .split('-')
        .map(Number);

      return new Date(
        year,
        month - 1,
        day
      ).toLocaleDateString(
        undefined,
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }
      );
    };

  return (
    <View>
      <Text
        style={
          commonStyles.fieldLabel
        }
      >
        When is it due?
        (optional)
      </Text>

      <View
        style={
          createChoreStyles.dateRow
        }
      >
        {/* DATE */}

        <View
          style={
            createChoreStyles.dateField
          }
        >
          <Text
            style={
              createChoreStyles.dateInputLabel
            }
          >
            Due date
          </Text>

          <Pressable
            style={[
              commonStyles.input,
              createChoreStyles.pickerButton,
            ]}
            onPress={() =>
              setShowDatePicker(true)
            }
          >
            <Text
              style={
                dueDate
                  ? createChoreStyles.pickerButtonText
                  : createChoreStyles.pickerPlaceholder
              }
            >
              {getReadableDate()}
            </Text>
          </Pressable>
        </View>

        {/* TIME */}

        <View
          style={
            createChoreStyles.dateField
          }
        >
          <Text
            style={
              createChoreStyles.dateInputLabel
            }
          >
            Due time
          </Text>

          <Pressable
            style={[
              commonStyles.input,
              createChoreStyles.pickerButton,
            ]}
            onPress={() =>
              setShowTimePicker(true)
            }
          >
            <Text
              style={
                dueTime
                  ? createChoreStyles.pickerButtonText
                  : createChoreStyles.pickerPlaceholder
              }
            >
              {dueTime ||
                'Choose time'}
            </Text>
          </Pressable>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={
            getCurrentDateValue()
          }
          mode="date"
          minimumDate={
            new Date()
          }
          onChange={(
            event,
            selectedDate
          ) => {
            setShowDatePicker(
              false
            );

            if (
              event.type ===
                'set' &&
              selectedDate
            ) {
              onDateChange(
                formatDateForStorage(
                  selectedDate
                )
              );
            }
          }}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={
            getCurrentTimeValue()
          }
          mode="time"
          is24Hour
          onChange={(
            event,
            selectedTime
          ) => {
            setShowTimePicker(
              false
            );

            if (
              event.type ===
                'set' &&
              selectedTime
            ) {
              onTimeChange(
                formatTimeForStorage(
                  selectedTime
                )
              );
            }
          }}
        />
      )}
    </View>
  );
}