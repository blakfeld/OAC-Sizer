"""
server.py:

Author: Corwin Brown <corwin@corwinbrown.com>
"""
from __future__ import print_function, absolute_import

import logging
import os

import bottle

from server import defaults
from server.instances import AWSInstances
from server.utils import no_cache


app = bottle.Bottle()
instance_data = None

API_PREFIX = '/api/v1.0'
CACHE_MAX_AGE = os.environ.get('CACHE_MAX_AGE', defaults.CACHE_MAX_AGE)
DEBUG_MODE = False
INSTANCES_JSON_URL = os.environ.get('INSTANCES_JSON_URL',
                                    defaults.INSTANCES_JSON_URL)
STATIC_PATH = os.environ.get('STATIC_PATH', defaults.STATIC_PATH)
STATIC_LIB_PATH = os.environ.get('STATIC_LIB_PATH', defaults.STATIC_LIB_PATH)


##
# Frontend Routes.
##


@app.get('/')
@no_cache(DEBUG_MODE)
def get_index():
    """
    GET our index page.

    Returns:
        static file
    """
    logging.debug('Serving "index.html"')

    return bottle.static_file('index.html', root=STATIC_PATH)


##
# API Routes.
##


@app.get(API_PREFIX + '/instances')
def get_instances():
    """
    Get raw instance data.

    WARNING:
        This is a _huge_ amount of data.

    Returns:
        dict
    """
    logging.debug('Serving instance data.')

    return instance_data.get_instances()


@app.get(API_PREFIX + '/instances/types')
def get_instance_types():
    """
    Get a list of all instance types. Filterable by required CPU,
        Memory, and Storage needs via query parameters.

    Returns:
        dict
    """
    logging.debug('Serving instance type data.')

    return instance_data.get_instance_types(
        filter_max_cpu=bottle.request.query.requiredCpu,
        filter_max_memory=bottle.request.query.requiredMemory,
        filter_max_storage=bottle.request.query.requiredStorage)


@app.get(API_PREFIX + '/instances/types/<instance_type>')
def get_specific_instance_type(instance_type):
    """
    Get all the data on a specific instance type.

    Args:
        instance_type (str):    The instance type to get data for.

    Returns:
        dict
    """
    logging.debug('Serving instance data for type "%s"', instance_type)

    return instance_data.get_instance_type(instance_type)


@app.get(API_PREFIX + '/prices')
def get_instance_prices():
    """
    Get pricing data for all instance types. Filterable by instance
        type via query parameters. Instance type query parameter can
        be a comma separated list.

    Returns:
        dict
    """
    logging.debug('Serving instance price data.')

    instance_types = bottle.request.query.instanceTypes or None
    instance_types = instance_types.split(',') if instance_types else []

    return instance_data.get_prices(filter_instance_types=instance_types)


@app.get(API_PREFIX + '/prices/<instance_type>')
def get_specific_instance_prices(instance_type):
    """
    Get pricing data for a specific instance type.

    Args:
        instance_type (str):    The instance type tog et pricing
                                    data for.

    Returns:
        dict
    """
    logging.debug('Serving instance price data for type "%s"', instance_type)

    return instance_data.get_price_instance_type(instance_type)


##
# Static resource routes.
##


@app.get('/static/<filename:path>')
@no_cache(DEBUG_MODE)
def get_static(filename):
    """
    Serve static files.

    Args:
        filename (str):     The file to retrieve.

    Returns:
        bottle.static_file
    """
    logging.debug('Serving "%s"', os.path.join(STATIC_PATH, filename))

    return bottle.static_file(filename, root=STATIC_PATH)


@app.get('/lib/<filename:path>')
@no_cache(DEBUG_MODE)
def get_lib(filename):
    """
    Server library files downloaded via "npm".o

    Args:
        filename (str):     The file to retrieve.

    Returns:
        bottle.static_file
    """
    logging.debug('Serving "%s"', os.path.join(STATIC_LIB_PATH, filename))

    return bottle.static_file(filename, root=STATIC_LIB_PATH)


def init_app(debug, log_level):
    """
    Perform Initialization actions before starting the server.

    Args:
        log_level (str):        Logging level.
    """
    global instance_data, DEBUG_MODE

    instance_data = AWSInstances(INSTANCES_JSON_URL, CACHE_MAX_AGE)
    logging.basicConfig(level=getattr(logging, log_level.upper()))

    DEBUG_MODE = debug

    logging.debug('App initialized.')


def serve(host,
          port,
          log_level='debug',
          reloader=False,
          server='wsgiref',
          debug=False):
    """
    Wrapper around running our application. This allows us to perform
        some setup tasks before running the server.

    Args:
        host (str):         The host address to listen on.
        port (int):         The port to bind to.
        log_level (str):    The desired application logging level.
        reloader (bool):    Toggle Bottle's livereload feature.
        server (str):       Bottle server to use.
        debug (bool):       Toggle Bottle debug mode.
    """
    init_app(debug, log_level)

    logging.debug('Running "%s" server.', server)
    bottle.debug(debug)
    app.run(host=host, port=int(port), reloader=reloader, server=server)
