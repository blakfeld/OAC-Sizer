"""
defaults.py:
    Default settings for the Python components of this application.

Author: Corwin Brown <corwin@corwinbrown.com>
"""
from __future__ import print_function, absolute_import

import os

from server import utils


APP_ROOT = os.path.join(utils.get_parent_abspath(__file__), '..', '..')
CACHE_MAX_AGE = 12
INSTANCES_JSON_URL = 'http://www.ec2instances.info/instances.json'
STATIC_LIB_PATH = os.path.join(APP_ROOT, 'node_modules')
STATIC_PATH = os.path.join(utils.get_parent_abspath(__file__), '..', 'static')
