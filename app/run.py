"""
run.py:
    Run our web server.

Usage:
    run.py [options]

Options:
    --host=HOST      Set listen address [default: 0.0.0.0].
    --port=PORT      Port number to run the app on [default: 9001].
    --production     Toggle running with a production Cherrpy server.

Author: Corwin Brown <corwin@corwinbrown.com>
"""
from __future__ import print_function, absolute_import

import os
import sys

from docopt import docopt

from server.server import serve


def main():
    """
    Main.
    """
    args = docopt(__doc__)

    production = args.get('--production', False)
    host = args['--host']
    port = int(os.environ.get('PORT', args['--port']))
    server = 'paste' if production else 'wsgiref'
    log_level = 'error' if production else 'debug'
    reloader = (not production)
    debug = (not production)

    serve(host=host,
          port=int(port),
          reloader=reloader,
          server=server,
          log_level=log_level,
          debug=debug)


if __name__ == '__main__':
    sys.exit(main())
