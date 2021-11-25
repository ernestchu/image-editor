#include <Title.hpp>

std::string title::title() {
    return "Image Editor";
}

Napi::String title::titleWrapped(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, title::title());
}

Napi::Object title::Init(Napi::Env env, Napi::Object exports) {
  exports.Set("title", Napi::Function::New(env, title::titleWrapped));
  return exports;
}
