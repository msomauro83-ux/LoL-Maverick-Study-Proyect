$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$project=Split-Path $PSScriptRoot -Parent
foreach ($size in @(192,512)) {
  $bitmap=New-Object System.Drawing.Bitmap($size,$size)
  $graphics=[System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode=[System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#142124'))
  $scale=$size/128.0
  $graphics.ScaleTransform($scale,$scale)
  $gold=New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#d6bc83'))
  $green=New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#9ad5bd'))
  $points=@(@(27,94),@(27,35),@(64,71),@(101,35),@(101,94),@(85,94),@(85,71),@(64,92),@(43,71),@(43,94)) | ForEach-Object { New-Object System.Drawing.PointF($_[0],$_[1]) }
  $graphics.FillPolygon($gold,[System.Drawing.PointF[]]$points)
  $gem=@(@(64,17),@(73,26),@(64,35),@(55,26)) | ForEach-Object { New-Object System.Drawing.PointF($_[0],$_[1]) }
  $graphics.FillPolygon($green,[System.Drawing.PointF[]]$gem)
  $bitmap.Save((Join-Path $project "dist\icon-$size.png"),[System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose();$bitmap.Dispose();$gold.Dispose();$green.Dispose()
}
