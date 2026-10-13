/**
 * Number input with a currency symbol prefix.
 *
 * The left padding is computed from the symbol's length and applied inline, so
 * long symbols ("CHF", "NT$", "د.إ") never collide with the typed value, no
 * matter which global CSS rules are in play.
 */
function MoneyInput({
  symbol = "",
  value,
  onChange,
  placeholder = "0",
  id,
  ariaLabel,
  autoFocus = false,
}) {
  const glyphs = Array.from(symbol).length;
  const paddingLeft = glyphs > 0 ? 16 + glyphs * 10 + 12 : 18;

  return (
    <div className="relative">
      {glyphs > 0 && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 font-black text-cyan-600"
        >
          {symbol}
        </span>
      )}

      <input
        id={id}
        type="number"
        inputMode="decimal"
        min="0"
        step="any"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        className="trip-input no-spinner"
        style={{ paddingLeft }}
      />
    </div>
  );
}

export default MoneyInput;
