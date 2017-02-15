"""
run.py:
    Run our web server.

Usage:
    run.py [options]

Options:
    --host=HOST      Set listen address [default: 127.0.0.1].
    --port=PORT      Port number to run the app on [default: 9001].
    --production     Toggle running with a production Cherrpy server.

Author: Corwin Brown <corwin@corwinbrown.com>
"""
from __future__ import print_function, absolute_import

import sys

from docopt import docopt

from server.server import serve


def main():
    """
    Main.
    """
    args = docopt(__doc__)

    host = args.get('--host', '127.0.0.1')
    port = int(args.get('--port', 9001))
    production = args.get('--production', False)

    # Use the reloader if we're not in production mode
    if production:
        server = 'paste'
        reloader = False
        log_level = 'error'
        debug = False
    else:
        server = 'wsgiref'
        reloader = True
        log_level = 'debug'
        debug = True

    serve(host=host,
          port=int(port),
          reloader=reloader,
          server=server,
          log_level=log_level,
          debug=debug)


if __name__ == '__main__':
    sys.exit(main())
