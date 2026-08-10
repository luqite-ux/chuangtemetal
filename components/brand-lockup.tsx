import Image from "next/image";

export function BrandLockup({ footer = false }: { footer?: boolean }) {
  return (
    <span className={`brand-lockup${footer ? " brand-lockup-footer" : ""}`}>
      <span className="brand-mark" aria-hidden="true">
        <Image src="/brand/logo.png" alt="" fill sizes="54px" priority={!footer} />
      </span>
      <span className="brand-name">ChuangTe<span>Metal</span></span>
    </span>
  );
}
