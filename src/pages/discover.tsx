import { _posts } from 'src/_mock';
import { CONFIG } from 'src/config-global';

import { DiscoverView } from 'src/sections/discover/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Blog - ${CONFIG.appName}`}</title>

      <DiscoverView />
    </>
  );
}
