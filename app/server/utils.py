"""
utils.py:
    Collection of utility functions that don't really belong anywhere
    else.

Author: Corwin Brown <corwin@corwinbrown.com>
"""
from __future__ import print_function, absolute_import

import os

from bottle import response


def get_parent_abspath(fpath=None):
    """
    Get the absolute path of a file's parent directory. This is
        useful for getting the path to a running script/application.

    Args:
        fpath (str):        The file path to use.

    Returns:
        str
    """
    fpath = fpath or __file__

    return os.path.dirname(os.path.abspath(fpath))


def no_cache(enabled=True):
    """
    Set Caching headers. Useful for development.

    Args:
        enabled (bool):     Toggle setting Cache-Control headers.

    Returns:
        func
    """
    def no_cache_decorator(func):
        def wrapper(*args, **kwargs):
            resp = func(*args, **kwargs)
            if enabled:
                response.headers[b'Cache-Control'] = b'private, no-cache'
            return resp
        return wrapper
    return no_cache_decorator
