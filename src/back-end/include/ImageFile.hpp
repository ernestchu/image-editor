#include <fstream>
#include <memory>
#include <vector>

namespace imgedit {
    struct PCXHeader {
        uint8_t  manufacturer;
        uint8_t  version;
        uint8_t  encoding;
        uint8_t  bitPerPixel;
        uint16_t xmin, ymin, xmax, ymax;
        uint16_t hdpi, vdpi;
        uint8_t  colormap[48];
        uint8_t  reserved;
        uint8_t  nPlanes;
        uint16_t bytesPerLine;
        uint16_t paletteInfo;
        uint16_t hScreenSize;
        uint16_t vScreenSize;
        uint8_t  filler[54];
    };

    class ImageFile {
        public:
            ImageFile() : status(true) {};
            virtual ~ImageFile() {};
            // ImageFile(const ImageFile&) = delete;
            // ImageFile& operator= (const ImageFile&) = delete;
            // ImageFile(const ImageFile&&) = delete;
            // ImageFile& operator= (const ImageFile&&) = delete;
            const std::vector<std::vector<uint8_t>>& getData() const { return data; }
            uint16_t getWidth() const { return width; }
            uint16_t getHeight() const { return height; }
            bool getStatus() const { return status; }
        protected:
            virtual unsigned int getHeaderSize() = 0;

            std::vector<std::vector<uint8_t>> data;
            uint16_t width, height;
            bool status;
    };

    class PCXImageFile : public ImageFile {
        public:
            // PCXImageFile() = delete;
            // ~PCXImageFile() = delete;
            // PCXImageFile(const PCXImageFile&) = delete;
            // PCXImageFile& operator= (const PCXImageFile&) = delete;
            // PCXImageFile(const PCXImageFile&&) = delete;
            // PCXImageFile& operator= (const PCXImageFile&&) = delete;

            PCXImageFile(std::string filename);
        protected:
            virtual unsigned int getHeaderSize() { return 128; }
            bool getRun(uint8_t& data, uint8_t& count, std::ifstream& ifs);

            PCXHeader header;
    };
}
