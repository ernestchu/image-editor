#include <napi.h>
#include <vector>
#include <string>
#include "ImageFile.hpp"

namespace image {

    Napi::Object imageArray(const Napi::CallbackInfo& info);

    Napi::Object Init(Napi::Env env, Napi::Object exports);

}
