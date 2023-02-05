import React from 'react';
import 'react-widgets/dist/css/react-widgets.css';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import momentLocalizer from 'react-widgets-moment';

momentLocalizer();

function DateTimePickerWrapper(props) {
  return (
    <DateTimePicker {...props} />
  );
}

export default DateTimePickerWrapper;
