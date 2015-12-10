---
title: Compiling GNU Coreutils to LLVM Bitcode
layout: post
width:
  - col-xs-12
  - col-md-11 col-md-offset-1
  - col-lg-7
sections:
  - title: About Me
    handle: about

  - title: Projects
    handle: projects

  - title: Publications
    handle: publ

  - title: All Things Emacs
    handle: emacs

  - title: Contact Me
    handle: contact

---

<!-- ## Generating LLVM bitcode for the GNU coreutils ## -->

To be able to analyze
[GNU coreutils](http://www.gnu.org/software/coreutils/coreutils.html)
we must create a single *whole-program* bitcode file per each coreutil
command. Since **GNU coreutils** are built with **autotools**, we must
tweak the build process accordingly.

### Prerequisites ###


1. Check that the
   [gold linker](https://en.wikipedia.org/wiki/Gold_(linker)) is
   installed on your system. On Fedora, it is normally installed under
   `/usr/bin/ld.gold`. We could change the default linker (i.e., `ld`)
   to point to `ld.gold` by using the `alternatives` utility, but it
   is *not* necessary.

2. Verify that `ld.gold` accepts *plugin* arguments by running:

   ~~~
   $ ld.gold -plugin
   ~~~

   You should see a warning such as `-plugin: missing argument`.

3. Verify that `$LLVM_HOME/lib` contains the LLVM gold plugin,
   `LLVMgold.so`. This is probably not the case for LLVM prebuilt
   binaries, so you may need to compile LLVM from source (see next
   [section](#compile-llvm)).


### Compiling LLVM from source (with LLVM gold plugin) ### {#compile-llvm}

See the [Getting Started](http://llvm.org/docs/GettingStarted.html)
page on how to build LLVM. Choose the `"Unix Makefiles"` as a
generator. In order to build the gold plugin, you also need to specify
the path to `plugin-api.h` of *binutils* (which you may also need to
build). The command to build LLVM should be something similar to:

{% highlight console %}
$ cd /path/to/llvm/
$ mkdir build
$ cd build
$ cmake -G "Unix Makefiles" -DLLVM_BINUTILS_INCDIR=/path/to/binutils/include ../llvm/
{% endhighlight %}

Building will take a long time, but when it is over it should have created
`lib/LLVMgold.so`.

Now you should be able to create whole program binaries via clang. By
applying the `-flto` flag while compiling, you create an LLVM bitcode
file instead of an object file. Then you need to pass the `emit-llvm`
plugin option to the gold linker, so that it, too, generates bitcode
instead of an executable. Test the previous scenario on a trivial
single file C project by running:

{% highlight console %}
$ clang -flto -c test.c
$ file test.o
test.o: LLVM IR bitcode
$ clang -flto -fuse-ld=gold -Wl,-plugin-opt=emit-llvm test.o
$ file a.out
a.out: LLVM IR bitcode
{% endhighlight %}


### Building GNU coreutils with GNU autoconf ###


So now we have to override some environment variables used by the
compiling and linking commands that will be generated by the
`configure` script of coreutils. Almost. The thing is that `configure`
makes many complicate tests that actually require that linking
generates an executable file. LLVM bitcode is not executable.

You may be tempted to change the `configure` script so that it tries
to execute the bitcode file with the `lli` tool, which is an
interpreter for LLVM bitcode. Do not go down that road though, since
it requires understanding and then performing many changes through an
intricate, autogenerated, and not that human friendly gigantic bourne
script!

It is much easier to first run the `configure` script so that it
generates normal *executable* files by clang (so that it passes the
tests) and then slightly change the linking command of the generated
Makefile, to add the aforementioned plugin option.

To recap:

1. Setup your environment and run `./configure`.

{% highlight console %}
$ export CC=clang
$ export CXX=clang++
$ export CFLAGS=" -flto -std=gnu99 "
$ export LDFLAGS=" -flto -fuse-ld=gold "
$ export RANLIB=llvm-ranlib
$ ./configure
{% endhighlight %}

2. Open the generated `Makefile`, locate the initialization of the
   `LDFLAGS` variable, and change it so that it includes the plugin
   option to emit LLVM bitcode. It should now look like:

   ~~~ make
   LDFLAGS =  -flto -fuse-ld=gold -Wl,-plugin-opt=emit-llvm
   ~~~

3. And now it's time to compile GNU coreutils at last. The build may
   fail at the end, at the testing stage, but it should reach the
   point where it has generated all the *whole-program* LLVM bitcode
   coreutils nonetheless.

4. Verify that this is indeed the case by sampling the
   `src` directory. E.g.:

{% highlight console %}
$ file src/who
src/who: LLVM IR bitcode
{% endhighlight %}