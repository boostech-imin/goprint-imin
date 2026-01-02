# Print Library (print-lib.js)

Simple JS helper for IMIN Go-Print demo flows.

Files
- lib/print-lib.js

Usage (HTML)
1) Include the library
   <script src="lib/print-lib.js"></script>

2) Provide the print iframe
   <iframe id="printSink" class="print-sink"></iframe>

3) Build commands and print
   const printer = new PrintLib();
   const commandParts = [
     "COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT",
     PrintLib.wrap("NOMOR ANTRIAN\n")
   ];
   printer.printParts(commandParts);

Notes
- COMMANDS.* helpers must be available in the environment that consumes the payload.
- printSink is required for iframe-based print.

Usage (PHP)
1) Use the same JS file and include it from your PHP page
   <script src="assets/js/printCommon.js"></script>

2) The usage stays the same as HTML.
