import { api } from '../../api';
import { logoutUser } from '../authUtilities';
import { COLOR_MODE_STORAGE_KEY } from 'theme/colorMode';

describe('authUtilities', () => {
  describe('logoutUser', () => {
    let replaceMock;

    beforeEach(() => {
      replaceMock = jest.fn();
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { ...window.location, replace: replaceMock }
      });
      localStorage.setItem('authConfig', '{}');
      document.cookie = 'user=test-user';
    });

    afterEach(() => {
      jest.restoreAllMocks();
      document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      localStorage.clear();
    });

    it('redirects to endSessionUrl when the response contains a valid URL', async () => {
      const endSessionUrl = 'https://idp.example.com/logout';
      jest.spyOn(api, 'post').mockResolvedValue({ data: { endSessionUrl: endSessionUrl } });

      await logoutUser();

      expect(replaceMock).toHaveBeenCalledWith(endSessionUrl);
    });

    it('keeps the color mode preference when clearing the session', async () => {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'dark');
      jest.spyOn(api, 'post').mockResolvedValue({ data: {} });

      await logoutUser();

      expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe('dark');
      expect(localStorage.getItem('authConfig')).toBeNull();
    });

    it('falls back to /login when endSessionUrl is malformed', async () => {
      jest.spyOn(api, 'post').mockResolvedValue({ data: { endSessionUrl: 'not-a-valid-url' } });

      await logoutUser();

      expect(replaceMock).toHaveBeenCalledWith('/login');
    });

    it('redirects to /login when the response has no endSessionUrl', async () => {
      jest.spyOn(api, 'post').mockResolvedValue({ data: {} });

      await logoutUser();

      expect(replaceMock).toHaveBeenCalledWith('/login');
    });
  });
});
