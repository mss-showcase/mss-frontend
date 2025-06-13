import React from 'react';
import { View, Text } from 'react-native';
import { sharedStyles } from './styles';

export default function AboutScreen() {
  return (
    <View style={sharedStyles.content}>
      <Text style={sharedStyles.header}>About this application</Text>
      <Text style={sharedStyles.text}>
        This application demonstrates the capabilities of the AWS platform and what one can do with the help of AI.{"\n\n"}
        It is built using React, TypeScript, and various AWS services.{"\n\n"}
        What you can try out here: see the stock data of Alpha Vantage and can apply various stock markers on the chart.
      </Text>
    </View>
  );
}