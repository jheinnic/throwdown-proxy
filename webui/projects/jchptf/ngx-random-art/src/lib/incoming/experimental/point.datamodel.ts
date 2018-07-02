import {from, Observable} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';


export class Point
{
  public readonly x: number = 0;

  public readonly y: number = 0;

  static asString(point: Point): string
  {
    let retVal: string;

    if (typeof point === 'object') {
      retVal = `<${point.x}, ${point.y}>`;
    } else if (typeof point === 'number') {
      retVal = `number(${point})`;
    } else {
      retVal = `**unknown point(${point})**`;
    }

    return retVal;
  }

  public constructor(point?: Point, override?: Partial<Point>)
  {
    Object.assign(this, point, override);
  }

  protected getLabel() { return 'Point'; }

  public withId(id: number)
  {
    return new IndexedPoint(this, {id: id});
  }

  public withFillStyle(fillStyle: string)
  {
    return new PaintablePoint(this, {fillStyle: fillStyle});
  }
}


export class IndexedPoint extends Point
{
  public readonly id: number = 0;

  public constructor(base?: Point, override?: Partial<IndexedPoint>)
  {
    super(base, override);
    Object.assign(this, base, override);
  }

  protected getLabel() { return 'IndexedPoint -> ' + super.getLabel(); }
}


export class PaintablePoint extends IndexedPoint
{
  public readonly fillStyle: FillStyle = 'rgb(0,0,0)';

  static asString(paintPoint: PaintablePoint)
  {
    let retVal: string;
    if (typeof paintPoint === 'object') {
      retVal = `(${paintPoint.fillStyle}) at <${paintPoint.x},${paintPoint.y}>`;
    } else {
      retVal = `**unknown paint point(${paintPoint})**`;
    }
    return retVal;
  }

  public constructor(base?: Point, override?: Partial<PaintablePoint>)
  {
    super(base, override);
    Object.assign(this, base, override);
  }

  protected getLabel() { return 'PaintablePoint ->' + super.getLabel(); }

  public withId(id: number): PaintablePoint
  {
    return new PaintablePoint(this, {id: id});
  }

  public paintTo(context: CanvasRenderingContext2D)
  {
    context.fillStyle = this.fillStyle;
    context.fillRect(this.x, this.y, 1, 1);
  }
}

export class PointMap
{
  static asString(pointMap: PointMap): string
  {
    let retVal: string;

    if (typeof pointMap === 'object') {
      retVal = `${Point.asString(pointMap.from)} -> ${Point.asString(pointMap.to)}`;
    } else if (typeof pointMap === 'number') {
      retVal = `number(${pointMap})`
    } else {
      retVal = `**unknown map(${pointMap})**`;
    }

    return retVal;
  }

  public constructor(readonly from: IndexedPoint, readonly to: Point) { }

  get id(): number
  {
    return this.from.id;
  }
}

export type FitOrFillType = 'fit' | 'fill' | 'square';

export type FillStyle = string | CanvasGradient | CanvasPattern;

