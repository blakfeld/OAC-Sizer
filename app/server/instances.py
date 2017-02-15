"""
instances.py:
    Class to help manage the 'instances.json' file that has the data
    we'll use to determine cluster pricing.

    The thought here is that while the 'instances.json' file isn't
    _huge_, it's not small either, so I really don't want to fetch
    it more often than I have to. I'd rather fetch it at start time
    and cache it in memory, then refresh it at some interval.

    I could cache it to disk, but since this application runs more
    or less as a daemon, I think there's only minimal benefit of
    that (especially since while it is bigger than I'd like to
    continuously fetch from the internet, it's not too big to keep
    in memory). I could also use something like a Redis queue, and
    just munge the data to better fit that model (and it mostly fits
    out of the box), but then I'm taking on the overhead of running
    Redis, and I really don't think I'm getting any big gains from
    that.

    If you disagree, shoot me an e-mail!


Author: Corwin Brown <corwin@corwinbrown.com>
"""
from __future__ import print_function, absolute_import

import copy
import logging
from datetime import datetime, timedelta

import requests


class AWSInstances(object):
    """
    Class for dealing with our 'instances.json' data.
    """

    def __init__(self, instances_json_url, cache_max_age):
        """
        Constructor.

        Args:
            instances_json_url (str):   The URL to use when fetching
                                            'instances.json'.
            cache_max_age (int):        The max age, in hours, of our
                                            cached instance data.
        """
        self.instances_json_url = instances_json_url
        self.cache_max_age = cache_max_age

        self._expire_time = None  # Track when our cached data expires.
        self._raw_data = None

        self._refresh_instances_json()

    @property
    def data(self):
        """
        Check if 'self.instances' is fresh enough, and then return
            the raw instance data.

        Returns:
          list
        """
        self._refresh_instances_json()

        return self._raw_data

    def get_instances(self):
        """
        Return all our instance data.

        Returns:
            dict
        """
        return self._json_wrapping(result=self.data)

    def get_instance_types(self,
                           max_cpu=None,
                           max_memory=None,
                           max_storage=None):
        """
        Return instance types based on the provided filters.

        Returns:
            dict
        """
        result = self.data
        if max_cpu:
            result = {k: v for k, v in result.iteritems()
                      if v['vCPU'] <= int(max_cpu)}
        if max_memory:
            result = {k: v for k, v in result.iteritems()
                      if v['memory'] <= int(max_memory)}
        if max_storage:
            result = {k: v for k, v in result.iteritems()
                      if v['storage'] and k['storage']['size'] <= int(max_storage)}

        return self._json_wrapping(result=result.keys())

    def get_instance_type(self, instance_type):
        """
        Return data on a single 'instance_type'.

        Args:
            instance_type (str):        The instance type to get data for.
        """

        return self._json_wrapping(result=self.data.get(instance_type))

    def get_pricing(self, region=None, instance_type_filter=None):
        """
        """
        result = {k: v['pricing'] for k, v in self.data.iteritems()}

        return self._json_wrapping(result=result)


    def _refresh_instances_json(self):
        """
        Check if 'self.instances' is fresh enough, and if not refresh
            it.
        """
        if self._expire_time and datetime.now() < self._expire_time:
            logging.debug('Refreshing instances cache...')
            return

        data = requests.get(self.instances_json_url).json()
        self._raw_data = self._clean_data(data)
        self._expire_time = (
            datetime.now() + timedelta(hours=self.cache_max_age))

    def _clean_data(self, data):
        """
        The data we're using has a boatload of information, and we
            really only need a little, so I'm going to clean it up
            a little bit. In a larger application, I'd use something
            like Marshmellow to marshall my data, but for this small
            usecase, I'm just going to prune the pricing data.

        The data is pruned for the following criteria:
            * We only really care about spot pricing, so we'll just
                pull out pricing data entirely, since it's a massive
                amount of data we don't need.

        I'm also performing exlusively reads, so let's reformat the
            data into a dict, so I can leverage lookups.

        Args:
            data (list):        The data to clean.

        Returns:
            list
        """
        data = {i.pop('instance_type'): i for i in data}

        result = {}
        for instance_type, attributes in data.iteritems():
            del attributes['pricing']
            result[instance_type] = attributes

        return data

    def _json_wrapping(self, **kwargs):
        """
        Return JSON friendly wrappings for our data.

        NOTE:
            'instances.json' uses both camelCase and snake_case, so
                I'm going to default to snake_case for no reason
                other than personal preference.

        Returns:
            dict
        """
        wrapping = {
            'expire_time': self._expire_time.strftime('%s'),
            'fetched_from': self.instances_json_url,
        }
        wrapping.update(kwargs)

        return wrapping
