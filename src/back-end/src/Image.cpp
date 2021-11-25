#include <Image.hpp>

Napi::Object image::imageArray(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsString()) {
        Napi::TypeError::New(env, "Wrong number of arguments")
            .ThrowAsJavaScriptException();
        return Napi::Object(env, env.Null());
    }

    auto filename = info[0].As<Napi::String>().Utf8Value();
    auto ifs = std::ifstream(filename);
    std::unique_ptr<imgedit::ImageFile> img;
    switch (ifs.peek()) {
        case 10:
            ifs.close();
            img = std::unique_ptr<imgedit::PCXImageFile>(new imgedit::PCXImageFile(filename));
            break;
        default:
            ifs.close();
            return Napi::Uint8Array::New(env, 0, napi_uint8_clamped_array);
    }

    if (!img->getStatus()) {
        Napi::TypeError::New(env, "Corrupted image or older version of PCX.")
            .ThrowAsJavaScriptException();
        return Napi::Object(env, env.Null());
    }
    
    const auto& imgData = img->getData();
    auto nodeArray = Napi::Uint8Array::New(env, 4 * imgData[0].size(), napi_uint8_clamped_array);

    unsigned int count = 0;
    for (int i = 0; i < imgData[0].size(); i++) {
        for (int plane = 0; plane < imgData.size(); plane++) {
            nodeArray[count++] = imgData[plane][i];
        }
        if (imgData.size() < 4)
            nodeArray[count++] = 255;
    }

    auto obj = Napi::Object::New(env);
    obj.Set("filename", info[0].As<Napi::String>());
    obj.Set("data",     nodeArray);
    obj.Set("width",    Napi::Number::New(env, img->getWidth()));
    obj.Set("height",   Napi::Number::New(env, img->getHeight()));

    return obj;
}

Napi::Object image::Init(Napi::Env env, Napi::Object exports) {
    exports.Set("image", Napi::Function::New(env, image::imageArray));
    return exports;
}
