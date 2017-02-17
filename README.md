# Optimal AWS Cluster Sizer

Small web application to help size a compute cluster in AWS. A user will provide their CPU, RAM, and Storage requirements, then the application will present them two possible configurations:
    
1. The cheapest configuration, based on the most recent spot price.
2. The cheapest configuration, based on the most recent spot price that would require the smallest number of instances.

You can try it out [on Heroku](https://oac-sizer.herokuapp.com/).


## Running the application


### Local Environment

To prepare the runtime environment, you need to do two things:

1. Install the required libraries.
2. Setup environment variables for AWS access (used only to get spot prices).

Installing the required libraries should be easy enough, just run:

```
$ make build-libs
```

That will construct a virtualenv, install all required python packages, then install all required npm packages.

As far as setting up AWS access, under the hood it's just boto3, so all the instructions [found here](https://boto3.readthedocs.io/en/latest/guide/configuration.html) apply. I recommend using environment variables, like so:

```
$ export AWS_ACCESS_KEY_ID=<aws_access_key_id>
$ export AWS_SECRET_ACCESS_KEY=<aws_secret_access_key>
$ export AWS_DEFAULT_REGION=<region_to_use>
```

For ease of use, I just have that loaded into a shell script.

To run the application in development mode (which uses a single threaded server and does some live-reloading), run:

```
$ make run
```

By default the application runs on port `9001`, so you should be able to access it at: http://localhost:9001

To run the application in production mode (which uses the Paste multi-threaded server), run:

```
$ make run-production
```


### Docker

You also have the option of running the application inside of a docker container. In order to do that, you'll still need to provide those AWS credentials. Currently that's wired in via the `--env-file` flag. So create a file that looks like:

```
AWS_ACCESS_KEY_ID=<aws_access_key_id>
AWS_SECRET_ACCESS_KEY=<aws_secret_access_key>
AWS_DEFAULT_REGION=<region_to_use>
```

To build the container, run:

```
$ make docker-build
```

Then to run the container:

```
$ make docker-run env-file=<env_file_you_created_above>
```

Or, more concisely:

```
$ make docker env-file=<env_file_you_created_above>
```
