import { Input, Form, Button } from "antd";
import clsx from "clsx";
import React, { useMemo, useState, useEffect, useRef } from "react";

interface ColorPickerProps {
  buttonAriaLabel?: string;
  buttonIconClassName?: string;
  buttonLabel?: string;
  color: string;
  onChange?: (color: string) => void;
  title?: string;
  children?: React.ReactNode;
}

const WIDTH = 210;
const HEIGHT = 150;

function ColorPicker({ color, children, onChange }: ColorPickerProps) {
  const basicColors = useMemo(
    () => [
      "#d0021b",
      "#f5a623",
      "#f8e71c",
      "#8b572a",
      "#7ed321",
      "#417505",
      "#bd10e0",
      "#9013fe",
      "#4a90e2",
      "#50e3c2",
      "#b8e986",
      "#000000",
      "#4a4a4a",
      "#9b9b9b",
      "#ffffff",
    ],
    []
  );

  const [selfColor, setSelfColor] = useState(transformColor("hex", color));
  const [inputColor, setInputColor] = useState(color);
  const innerDivRef = useRef(null);

  const saturationPosition = useMemo(
    () => ({
      x: (selfColor.hsv.s / 100) * WIDTH,
      y: ((100 - selfColor.hsv.v) / 100) * HEIGHT,
    }),
    [selfColor.hsv.s, selfColor.hsv.v]
  );

  const huePosition = useMemo(
    () => ({
      x: (selfColor.hsv.h / 360) * WIDTH,
    }),
    [selfColor.hsv]
  );

  const onSetHex = (hex: string) => {
    setInputColor(hex);
    if (/^#[0-9A-Fa-f]{6}$/i.test(hex)) {
      const newColor = transformColor("hex", hex);
      setSelfColor(newColor);
    }
  };

  const onMoveSaturation = ({ x, y }: Position) => {
    const newHsv = {
      ...selfColor.hsv,
      s: (x / WIDTH) * 100,
      v: 100 - (y / HEIGHT) * 100,
    };
    const newColor = transformColor("hsv", newHsv);
    setSelfColor(newColor);
    setInputColor(newColor.hex);
  };

  const onMoveHue = ({ x }: Position) => {
    const newHsv = { ...selfColor.hsv, h: (x / WIDTH) * 360 };
    const newColor = transformColor("hsv", newHsv);

    setSelfColor(newColor);
    setInputColor(newColor.hex);
  };

  useEffect(() => {
    if (color === undefined) return;
    const newColor = transformColor("hex", color);
    setSelfColor(newColor);
    setInputColor(newColor.hex);
  }, [color]);

  return (
    <>
      <div className="px-[20px] pt-[5px] pb-[20px]" ref={innerDivRef}>
        <Form.Item label="Hex" className="mb-2">
          <Input
            onChange={(e) => onSetHex(e.target.value)}
            value={inputColor}
          />
        </Form.Item>
        <div className="m-0 flex flex-wrap gap-2 p-0">
          {basicColors.map((basicColor) => (
            <button
              className={clsx(
                "h-4 w-4 cursor-pointer list-none rounded-full border border-solid bg-brand-900"
              )}
              key={basicColor}
              style={{ backgroundColor: basicColor }}
              onClick={() => {
                setInputColor(basicColor);
                setSelfColor(transformColor("hex", basicColor));
              }}
            />
          ))}
        </div>
        <ColorPicker.MoveWrapper
          className="color-picker-saturation relative mt-4 h-[150px] w-full select-none"
          style={{ backgroundColor: `hsl(${selfColor.hsv.h}, 100%, 50%)` }}
          onChange={onMoveSaturation}
        >
          <div
            className="color-picker-saturation_cursor w-5 h-5 rounded-[50%] absolute box-border shadow-lg"
            style={{
              backgroundColor: selfColor.hex,
              left: saturationPosition.x,
              top: saturationPosition.y,
            }}
          />
        </ColorPicker.MoveWrapper>
        <ColorPicker.MoveWrapper
          className="color-picker-hue relative mt-4 h-3 w-full select-none rounded-xl"
          onChange={onMoveHue}
        >
          <div
            className="color-picker-hue_cursor w-5 h-5 absolute rounded-[50%] box-border shadow"
            style={{
              backgroundColor: `hsl(${selfColor.hsv.h}, 100%, 50%)`,
              left: huePosition.x,
            }}
          />
        </ColorPicker.MoveWrapper>
        <div
          className="mt-4 h-5 w-full border border-solid border-brand-200"
          style={{ backgroundColor: selfColor.hex }}
        />
        <div className="mt-3 flex justify-end">
          <Button
            type="primary"
            size="small"
            className="!shadow-none"
            onClick={() => {
              onChange?.(selfColor.hex);
              setInputColor(selfColor.hex);
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
      {children}
      <style jsx global>{`
        .color-picker-saturation {
          background-image: linear-gradient(transparent, black),
            linear-gradient(to right, white, transparent);
        }
        .color-picker-saturation_cursor {
          border: 2px solid #ffffff;
          transform: translate(-10px, -10px);
        }

        .color-picker-hue {
          background-image: linear-gradient(
            to right,
            rgb(255, 0, 0),
            rgb(255, 255, 0),
            rgb(0, 255, 0),
            rgb(0, 255, 255),
            rgb(0, 0, 255),
            rgb(255, 0, 255),
            rgb(255, 0, 0)
          );
        }

        .color-picker-hue_cursor {
          border: 2px solid #ffffff;
          transform: translate(-10px, -4px);
        }
      `}</style>
    </>
  );
}

export default ColorPicker;

export interface Position {
  x: number;
  y: number;
}

interface MoveWrapperProps {
  className?: string;
  style?: React.CSSProperties;
  onChange: (position: Position) => void;
  children: JSX.Element;
}

ColorPicker.MoveWrapper = function MoveWrapper({
  className,
  style,
  onChange,
  children,
}: MoveWrapperProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const move = (e: React.MouseEvent | MouseEvent): void => {
    if (divRef.current) {
      const { current: div } = divRef;
      const { width, height, left, top } = div.getBoundingClientRect();

      const x = clamp(e.clientX - left, width, 0);
      const y = clamp(e.clientY - top, height, 0);

      onChange({ x, y });
    }
  };

  const onMouseDown = (e: React.MouseEvent): void => {
    if (e.button !== 0) return;

    move(e);

    const onMouseMove = (_e: MouseEvent): void => {
      move(_e);
    };

    const onMouseUp = (_e: MouseEvent): void => {
      document.removeEventListener("mousemove", onMouseMove, false);
      document.removeEventListener("mouseup", onMouseUp, false);

      move(_e);
    };

    document.addEventListener("mousemove", onMouseMove, false);
    document.addEventListener("mouseup", onMouseUp, false);
  };

  return (
    <div
      ref={divRef}
      className={className}
      style={style}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
};

function clamp(value: number, max: number, min: number) {
  return value > max ? max : value < min ? min : value;
}

interface RGB {
  b: number;
  g: number;
  r: number;
}
interface HSV {
  h: number;
  s: number;
  v: number;
}
interface Color {
  hex: string;
  hsv: HSV;
  rgb: RGB;
}

export function toHex(value: string): string {
  if (!value.startsWith("#")) {
    const ctx = document.createElement("canvas").getContext("2d");

    if (!ctx) {
      throw new Error("2d context not supported or canvas already initialized");
    }

    ctx.fillStyle = value;

    return ctx.fillStyle;
  } else if (value.length === 4 || value.length === 5) {
    value = value
      .split("")
      .map((v, i) => (i ? v + v : "#"))
      .join("");

    return value;
  } else if (value.length === 7 || value.length === 9) {
    return value;
  }

  return "#000000";
}

function hex2rgb(hex: string): RGB {
  const rbgArr = (
    hex
      .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        return `#${r}${r}${g}${g}${b}${b}`;
      })
      .substring(1)
      .match(/.{2}/g) || []
  ).map((x) => parseInt(x, 16));

  return {
    b: rbgArr[2] as number,
    g: rbgArr[1] as number,
    r: rbgArr[0] as number,
  };
}

function rgb2hsv({ r, g, b }: RGB): HSV {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);

  const h = d
    ? (max === r
        ? (g - b) / d + (g < b ? 6 : 0)
        : max === g
        ? 2 + (b - r) / d
        : 4 + (r - g) / d) * 60
    : 0;
  const s = max ? (d / max) * 100 : 0;
  const v = max * 100;

  return { h, s, v };
}

function hsv2rgb({ h, s, v }: HSV): RGB {
  s /= 100;
  v /= 100;

  const i = ~~(h / 60);
  const f = h / 60 - i;
  const p = v * (1 - s);
  const q = v * (1 - s * f);
  const t = v * (1 - s * (1 - f));
  const index = i % 6;

  // @ts-ignore
  const r = Math.round([v, q, p, p, t, v][index] * 255);
  // @ts-ignore
  const g = Math.round([t, v, v, q, p, p][index] * 255);
  // @ts-ignore
  const b = Math.round([p, p, t, v, v, q][index] * 255);

  return { b, g, r };
}

function rgb2hex({ b, g, r }: RGB): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function transformColor<M extends keyof Color, C extends Color[M]>(
  format: M,
  color: C
): Color {
  let hex: Color["hex"] = toHex("#121212");
  let rgb: Color["rgb"] = hex2rgb(hex);
  let hsv: Color["hsv"] = rgb2hsv(rgb);

  if (format === "hex") {
    const value = color as Color["hex"];

    hex = toHex(value);
    rgb = hex2rgb(hex);
    hsv = rgb2hsv(rgb);
  } else if (format === "rgb") {
    const value = color as Color["rgb"];

    rgb = value;
    hex = rgb2hex(rgb);
    hsv = rgb2hsv(rgb);
  } else if (format === "hsv") {
    const value = color as Color["hsv"];

    hsv = value;
    rgb = hsv2rgb(hsv);
    hex = rgb2hex(rgb);
  }

  return { hex, hsv, rgb };
}
