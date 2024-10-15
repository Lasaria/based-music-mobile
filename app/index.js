import { Redirect } from 'expo-router';
import { tokenManager } from '../utils/tokenManager';

export default function Index() {
  if (!tokenManager.getAccessToken) {
  return <Redirect href="/welcome" />;
  } else {
    return <Redirect href="/homeIndex" />
  }
}