import {
  createElement,
} from 'react';

import {
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
  const getToday = () => {
    const today =
      new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        today.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const inputStyle = {
    width: '100%',

    boxSizing:
      'border-box' as const,

    border:
      '1px solid #E8E3EE',

    borderRadius: '12px',

    backgroundColor:
      '#FFFFFF',

    color:
      '#17152B',

    fontSize:
      '14px',

    padding:
      '13px 14px',

    outline:
      'none',

    fontFamily:
      'inherit',
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

          {createElement(
            'input',
            {
              type: 'date',

              value:
                dueDate,

              min:
                getToday(),

              onChange:
                (
                  event: any
                ) =>
                  onDateChange(
                    event.target
                      .value
                  ),

              style:
                inputStyle,
            }
          )}
        </View>

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

          {createElement(
            'input',
            {
              type: 'time',

              value:
                dueTime,

              onChange:
                (
                  event: any
                ) =>
                  onTimeChange(
                    event.target
                      .value
                  ),

              style:
                inputStyle,
            }
          )}
        </View>
      </View>
    </View>
  );
}