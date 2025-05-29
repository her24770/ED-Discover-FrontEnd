import { _posts } from 'src/_mock';
import { CONFIG } from 'src/config-global';

import { SongView} from 'src/sections/song/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Blog - ${CONFIG.appName}`}</title>

      <SongView posts={_posts} />
    </>
  );
}
