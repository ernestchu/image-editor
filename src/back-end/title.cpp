#include <napi.h>

static Napi::String Method(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "Image Editor");
}

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "title"),
              Napi::Function::New(env, Method));
  return exports;
}

NODE_API_MODULE(title, Init)
