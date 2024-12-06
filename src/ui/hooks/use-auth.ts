import { useSelector } from 'react-redux';


export function useAuth() {
  const { nickName, token, id } = useSelector((state: RootState) => state.user);

  return {
    isAuth: !!nickName,
    nickName,
    token,
    id
  }
}