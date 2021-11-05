#include <napi.h>
#include "include/Title.hpp"
#include "include/Image.hpp"

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
            image::Init(env, exports);
  return    title::Init(env, exports);
}

NODE_API_MODULE(CMAKE_PROJECT_NAME, InitAll)
