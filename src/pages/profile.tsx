import { CONFIG } from 'src/config-global';

import { ProfileView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`ProfileCONFIG.appName}`}</title>

      <ProfileView />
    </>
  );
}
