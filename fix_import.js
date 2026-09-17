const fs = require("fs");
const path = "c:/Users/ngumk/Desktop/uspa/apps/web/app/admin/import/page.tsx";
let c = fs.readFileSync(path, "utf8");

// Fix 1: Close grid div in preview section
c = c.replace(
  '<p className="text-xs text-zinc-500">Total</p>\n              </div>\n            {validationResult.errors',
  '<p className="text-xs text-zinc-500">Total</p>\n              </div>\n            </div>\n            {validationResult.errors'
);

// Fix 2: Close errors div in preview (the first occurrence)
c = c.replace(
  '</div>\n            )}',
  '</div>\n              </div>\n            )}'
);

// Fix 3: Close grid in result
c = c.replace(
  '<p className="text-xs text-red-700 dark:text-red-400">Errors</p>\n              </div>\n            {importResult.errors',
  '<p className="text-xs text-red-700 dark:text-red-400">Errors</p>\n              </div>\n            </div>\n            {importResult.errors'
);

// Fix 4: Close flex container before CardContent
c = c.replace(
  '}</div>\n            </CardContent>',
  '}</div>\n              </div>\n            </CardContent>'
);

fs.writeFileSync(path, c, "utf8");
console.log("Fixed successfully");
