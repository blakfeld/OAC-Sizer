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
        self._raw = None

        self._refresh_instances_json()

    @property
    def raw(self):
        """
        Check if 'self.instances' is fresh enough, and then return
            the raw instance data.

        Returns:
          list
        """
        self._refresh_instances_json()

        return self._raw

    def get_instances(self):
        """
        Return all our instance data.

        Returns:
            dict
        """
        return self._json_wrapping(instances=self.raw)

    def get_instance_types(self,
                           max_cpu=None,
                           max_memory=None,
                           max_storage=None):
        """
        Return all instance types.

        Returns:
            dict
        """
        data = self.raw
        if max_cpu:
            data = filter(lambda x: x.get('vCPU') <= int(max_cpu), data)
        if max_memory:
            data = filter(lambda x: x.get('memory') <= int(max_memory), data)
        if max_storage:
            data = filter(
                lambda x: x.get('storage') and x.get('storage').get('size') <= int(max_storage),
                data)

        instance_types = map(lambda x: x.get('instance_type'), data)

        return self._json_wrapping(instance_types=instance_types)

    def get_instance_type(self, instance_type):
        """
        Return data on a single 'instance_type'.

        Args:
            instance_type (str):        The instance type to get data for.
        """
        instance_type = filter(
            lambda x: x.get('instance_type') == instance_type,
            self.raw)

        return self._json_wrapping(instance_type=instance_type)

    def _refresh_instances_json(self):
        """
        Check if 'self.instances' is fresh enough, and if not refresh
            it.
        """
        if self._expire_time and datetime.now() < self._expire_time:
            logging.debug('Refreshing instances cache...')
            return

        self._raw = requests.get(self.instances_json_url).json()
        self._expire_time = (
            datetime.now() + timedelta(hours=self.cache_max_age))

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
