import { _posts } from 'src/_mock';
import { CONFIG } from 'src/config-global';

import { GenreView} from 'src/sections/genre/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Genero - ${CONFIG.appName}`}</title>

      <GenreView />
    </>
  );
}
