import { View, Text } from 'react-native';
import { sharedStyles } from './styles';
import { RSSFeedReader } from './RSSFeedReader';

function NewsScreen() {
  return (
    <View style={sharedStyles.content}>
      <Text style={sharedStyles.header}>News</Text>
      <RSSFeedReader />
    </View>
  );
}

export default NewsScreen;
