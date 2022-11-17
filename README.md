load(
    "//absl:copts/configure_copts.bzl",
    "ABSL_DEFAULT_COPTS",
    "ABSL_DEFAULT_LINKOPTS",
    "ABSL_TEST_COPTS",
)
package(default_visibility = ["//visibility:public"])
licenses(["notice"])
cc_library(
    name = "algorithm",
    hdrs = ["algorithm.h"],
    copts = ABSL_DEFAULT_COPTS,
    linkopts = ABSL_DEFAULT_LINKOPTS,
    deps = [
        "//absl/base:config",
    ],
)
cc_test(
    name = "algorithm_test",
    size = "small",
    srcs = ["algorithm_test.cc"],
    copts = ABSL_TEST_COPTS,
    linkopts = ABSL_DEFAULT_LINKOPTS,
    deps = [
        ":algorithm",
        "//absl/base:config",
        "@com_google_googletest//:gtest_main",
    ],
)
cc_binary(
    name = "algorithm_benchmark",
    testonly = 1,
    srcs = ["equal_benchmark.cc"],
    copts = ABSL_TEST_COPTS,
    linkopts = ABSL_DEFAULT_LINKOPTS,
    tags = ["benchmark"],
    deps = [
        ":algorithm",
        "//absl/base:core_headers",
        "@com_github_google_benchmark//:benchmark_main",
    ],
)
cc_library(
    name = "container",
    hdrs = [
        "container.h",
    ],
    copts = ABSL_DEFAULT_COPTS,
    linkopts = ABSL_DEFAULT_LINKOPTS,
    deps = [
        ":algorithm",
        "//absl/base:core_headers",
        "//absl/meta:type_traits",
    ],
)
cc_test(
    name = "container_test",
    srcs = ["container_test.cc"],
    copts = ABSL_TEST_COPTS,
    linkopts = ABSL_DEFAULT_LINKOPTS,
    deps = [
        ":container",
        "//absl/base",
        "//absl/base:core_headers",
        "//absl/memory",
        "//absl/types:span",
        "@com_google_googletest//:gtest_main",
    ],
)
