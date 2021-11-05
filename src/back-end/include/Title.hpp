#include <napi.h>
#include <string>

namespace title {

    std::string title();
    Napi::String titleWrapped(const Napi::CallbackInfo& info);

    Napi::Object Init(Napi::Env env, Napi::Object exports);

}
